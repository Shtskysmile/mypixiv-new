package org.example.PCOI.Security;

import org.example.PCOI.Utils.JwtUtil;
import org.example.PCOI.Utils.TokenProcess;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * 从 Authorization: Bearer <token> 解析 JWT，并把登录信息写入 SecurityContext。
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // 没有 token：放行，交给后续鉴权规则决定是否需要登录
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 复用你现有的 TokenProcess / JwtUtil 解析逻辑
            String userId = (String) TokenProcess.getAttributeFromToken(authHeader, "userId");
            String username = (String) TokenProcess.getAttributeFromToken(authHeader, "username");
            Integer role = (Integer) TokenProcess.getAttributeFromToken(authHeader, "role");
            Integer type = (Integer) TokenProcess.getAttributeFromToken(authHeader, "type");

            LoginUser loginUser = new LoginUser(userId, username, role, type);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(loginUser, null, loginUser.getAuthorities());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ex) {
            // token 非法：清空上下文，继续走后续链（最终会被 security entry point 处理成 401）
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}

