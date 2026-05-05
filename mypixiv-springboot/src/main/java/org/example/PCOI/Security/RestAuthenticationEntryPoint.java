package org.example.PCOI.Security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.PCOI.ResponseDTO.Result;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * 未登录时返回统一 Result 结构（HTTP 401）。
 */
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        // 这里的文案你可以自行统一
        Result<String> body = Result.error("未登录或 token 无效");
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}

