package com.example.architectureplatform.user.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponse(
   Long id,
   String fullname,
   String email,
   String phone,
   boolean enabled,
   boolean emailVerified,
   Set<String> roles,
   LocalDateTime createdAt,
   LocalDateTime updatedAt
) {}
