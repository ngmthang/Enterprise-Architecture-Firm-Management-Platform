package com.example.architectureplatform.auth.service;

import com.example.architectureplatform.auth.dto.request.AuthRequest;
import com.example.architectureplatform.auth.dto.response.AuthResponse;
import com.example.architectureplatform.security.principal.UserPrincipal;
import com.example.architectureplatform.security.util.SecurityUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;

    public AuthService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return buildAuthResponse(userPrincipal, "Authenticated successfully");
    }

    public AuthResponse getCurrentUser() {
        UserPrincipal userPrincipal = SecurityUtils.getCurrentUserPrincipal();
        return buildAuthResponse(userPrincipal, "Current authenticated user fetched successfully");
    }

    private AuthResponse buildAuthResponse(UserPrincipal userPrincipal, String message) {
        Set<String> roles = userPrincipal.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .map(authority -> authority.startsWith("ROLE_")
                            ? authority.substring(5)
                            : authority)
                .collect(Collectors.toSet());

        return new AuthResponse(
                userPrincipal.getUsername(),
                roles,
                message
        );
    }
}
