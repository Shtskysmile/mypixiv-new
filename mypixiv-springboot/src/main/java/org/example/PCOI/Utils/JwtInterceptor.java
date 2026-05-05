package org.example.PCOI.Utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

public class JwtInterceptor implements HandlerInterceptor {
    private static final java.util.logging.Logger log = java.util.logging.Logger.getLogger(JwtInterceptor.class.getName());
    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) {
        String requestURI = request.getRequestURI();
        log.info("[JwtInterceptor] intercept: " + requestURI);

        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            try {
                Map<String, Object> claims = JwtUtil.parseToken(token);
                request.setAttribute("claims", claims);
                log.info("[JwtInterceptor] token ok: " + requestURI);
                return true;
            } catch (Exception e) {
                log.warning("[JwtInterceptor] token invalid: " + requestURI + ", err=" + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return false;
            }
        }
        log.warning("[JwtInterceptor] missing Authorization header: " + requestURI);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return false;
    }
}