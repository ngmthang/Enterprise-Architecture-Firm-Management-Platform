package com.example.architectureplatform.auth.dto.response;

import java.util.Set;

public record AuthResponse(
        String email,
        Set<String> roles,
        String message
) {
}
