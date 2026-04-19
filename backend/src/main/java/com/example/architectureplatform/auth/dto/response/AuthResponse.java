package com.example.architectureplatform.auth.dto.response;

import java.util.Set;

public record AuthResponse(
        String email,
        String fullName,
        Set<String> roles,
        String message,
        String accessToken
) {
}
