package org.example.PCOI.Utils;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.PCOI.Service.Inter.LogService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.logging.Logger;

@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    private static final Logger log = Logger.getLogger(RequestLoggingInterceptor.class.getName());

    private final LogService logService;

    public RequestLoggingInterceptor(LogService logService) {
        this.logService = logService;
    }

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request,
                             @NonNull HttpServletResponse response,
                             @NonNull Object handler) throws Exception {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            String userId = (String) TokenProcess.getAttributeFromToken(token, "userId");
            String rawToken = token.substring(7);
            Map<String, Object> claims = JwtUtil.parseToken(rawToken);

            String operation = request.getRequestURI();
            if (request.getDispatcherType() != DispatcherType.REQUEST || "/error".equals(operation)) {
                return true;
            }

            try {
                logService.logMethodExecution(userId, operation);
            } catch (Exception e) {
                // 日志记录失败不影响业务请求
                log.warning("[RequestLoggingInterceptor] log failed: " + e.getMessage());
            }

            request.setAttribute("claims", claims);
        }
        // 无论是否有token，都允许请求继续（由具体的拦截器决定是否需要认证）
        return true;
    }
}
