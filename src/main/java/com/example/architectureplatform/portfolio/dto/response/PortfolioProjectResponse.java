package com.example.architectureplatform.portfolio.dto.response;

import com.example.architectureplatform.portfolio.enums.PortfolioProjectStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PortfolioProjectResponse(
        Long id,
        String title,
        String slug,
        String shortDescription,
        String fullDescription,
        String location,
        String projectType,
        PortfolioProjectStatus status,
        boolean featured,
        Integer displayOrder,
        String coverImageUrl,
        LocalDate completedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}