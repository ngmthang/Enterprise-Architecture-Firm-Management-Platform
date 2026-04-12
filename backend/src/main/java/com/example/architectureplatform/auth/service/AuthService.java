package com.example.architectureplatform.auth.service;

import com.example.architectureplatform.auth.dto.request.AuthRequest;
import com.example.architectureplatform.auth.dto.response.AuthResponse;
import com.example.architectureplatform.security.principal.UserPrincipal;
import com.example.architectureplatform.security.util.JwtTokenProvider;
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
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(userPrincipal.getUsername());
        return buildAuthResponse(userPrincipal, "Authenticated successfully", token);
    }

    public AuthResponse getCurrentUser() {
        UserPrincipal userPrincipal = SecurityUtils.getCurrentUserPrincipal();
        return buildAuthResponse(userPrincipal, "Current authenticated user fetched successfully", null);
    }

    private AuthResponse buildAuthResponse(UserPrincipal userPrincipal, String message, String token) {
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
                message,
                token
        );
    }
}