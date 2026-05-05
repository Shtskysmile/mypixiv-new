package org.example.PCOI.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter();
    }

    @Bean
    public RestAuthenticationEntryPoint restAuthenticationEntryPoint() {
        return new RestAuthenticationEntryPoint();
    }

    @Bean
    public RestAccessDeniedHandler restAccessDeniedHandler() {
        return new RestAccessDeniedHandler();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 纯 API：关闭 csrf（如果你后面要做 cookie 登录，再重新评估）
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(restAuthenticationEntryPoint())
                        .accessDeniedHandler(restAccessDeniedHandler())
                )
                .authorizeHttpRequests(auth -> auth
                        // v1 登录注册放行
                        .requestMatchers("/api/v1/login", "/api/v1/register").permitAll()
                        // v2 登录注册放行
                        .requestMatchers("/api/v2/auth/login", "/api/v2/auth/register").permitAll()

                        // v2 密保问题和密码重置
                        .requestMatchers(
                                "/api/v2/users/security-issues",
                                "/api/v2/users/password"
                        ).permitAll()

                        // 匿名访问：首页列表 / 搜索 / 作品详情
                        // 首页列表
                        .requestMatchers(
                                "/api/v1/illustrations",
                                "/api/v1/mangas",
                                "/api/v1/allContributions",
                                "/api/v2/illustrations",
                                "/api/v2/mangas",
                                "/api/v2/contributions",
                                "/api/v2/contributions/ranking"
                        ).permitAll()
                        // 搜索
                        .requestMatchers(
                                "/api/v1/searchById",
                                "/api/v1/searchByName",
                                "/api/v1/searchByTag",
                                "/api/v2/search/**"
                        ).permitAll()

                        // Swagger / OpenAPI 放行（如果你项目启用了）
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // 静态资源放行
                        .requestMatchers("/files/**", "/img/**").permitAll()

                        // 其他全部需要登录
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

