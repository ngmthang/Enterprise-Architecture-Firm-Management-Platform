package com.example.architectureplatform.team.dto.response;

import java.time.LocalDateTime;

public record TeamMemberResponse(
        Long id,
        String fullName,
        String jobTitle,
        String shortBio,
        String fullBio,
        String profileImageUrl,
        String email,
        String phone,
        String linkedinUrl,
        Integer displayOrder,
        boolean featured,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}