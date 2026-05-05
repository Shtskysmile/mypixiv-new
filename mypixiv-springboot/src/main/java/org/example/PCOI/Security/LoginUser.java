package org.example.PCOI.Security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * 当前登录用户信息（从 JWT claims 中解析而来）。
 *
 * 你现有 token claims 字段：userId / username / role / type
 */
public class LoginUser implements UserDetails {

    private final String userId;
    private final String username;
    private final Integer role;
    private final Integer type;

    public LoginUser(String userId, String username, Integer role, Integer type) {
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.type = type;
    }

    public String getUserId() {
        return userId;
    }

    public Integer getRole() {
        return role;
    }

    public Integer getType() {
        return type;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 先用角色数值映射成 ROLE_x，后续你也可以改成更细粒度权限。
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        // JWT 场景不使用 password
        return "";
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

