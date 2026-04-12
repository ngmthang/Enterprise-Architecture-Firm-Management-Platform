package com.example.architectureplatform.service_catalog.dto.response;

import java.time.LocalDateTime;

public record ServiceOfferingResponse(
        Long id,
        String name,
        String slug,
        String shortDescription,
        String fullDescription,
        String icon,
        boolean featured,
        Integer displayOrder,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}