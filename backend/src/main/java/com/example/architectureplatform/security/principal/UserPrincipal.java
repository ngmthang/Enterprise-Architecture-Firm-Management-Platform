package com.example.architectureplatform.security.principal;

import com.example.architectureplatform.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {
    private final Long id;
    private final String fullname, email, password;
    private final boolean enabled, emailVerified;
    private final Set<GrantedAuthority> authorities;

    public UserPrincipal(Long id,
                         String fullname,
                         String email,
                         String password,
                         boolean enabled,
                         boolean emailVerified,
                         Set<GrantedAuthority> authorities) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.emailVerified = emailVerified;
        this.authorities = authorities;
    }

    public static UserPrincipal fromUser(User user) {
        Set<GrantedAuthority> authorities = user.getRoles()
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());

        return new UserPrincipal(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.isEnabled(),
                user.isEmailVerified(),
                authorities
        );
    }

    public Long getId() {
        return id;
    }

    public String getFullname() {
        return fullname;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
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

    @Override
    public boolean equals(Object object) {
        if(this == object) return true;
        if(!(object instanceof UserPrincipal that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
