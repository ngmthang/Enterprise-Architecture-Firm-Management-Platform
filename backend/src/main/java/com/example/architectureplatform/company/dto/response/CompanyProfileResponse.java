package com.example.architectureplatform.company.dto.response;

import java.time.LocalDateTime;

public record CompanyProfileResponse(
        Long id,
        String companyName,
        String tagline,
        String shortDescription,
        String fullDescription,
        String email,
        String phone,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String postalCode,
        String country,
        String websiteUrl,
        String facebookUrl,
        String instagramUrl,
        String linkedinUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}