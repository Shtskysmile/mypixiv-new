package org.example.PCOI.Utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

/**
 * JWT工具类
 * 用于生成和解析JWT令牌
 */
@Component
public class JwtUtil {

    private static String secretKey;

    @Value("${jwt.secret.key}")
    public void setSecretKey(String key) {
        JwtUtil.secretKey = key;
    }

    /**
     * 生成JWT令牌
     * @param claims 业务数据
     * @return JWT令牌字符串
     */
    public static String genToken(Map<String, Object> claims) {
        return JWT.create()
                .withClaim("claims", claims)
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 12))
                .sign(Algorithm.HMAC256(secretKey));
    }

    /**
     * 解析JWT令牌
     * @param token JWT令牌字符串
     * @return 业务数据
     */
    public static Map<String, Object> parseToken(String token) {
        return JWT.require(Algorithm.HMAC256(secretKey))
                .build()
                .verify(token)
                .getClaim("claims")
                .asMap();
    }
}

