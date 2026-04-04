package com.example.architectureplatform.portfolio.dto.request;

import com.example.architectureplatform.portfolio.enums.PortfolioProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdatePortfolioProjectRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must not exceed 200 characters")
        String title,

        @NotBlank(message = "Slug is required")
        @Size(max = 220, message = "Slug must not exceed 220 characters")
        String slug,

        @NotBlank(message = "Short description is required")
        @Size(max = 500, message = "Short description must not exceed 500 characters")
        String shortDescription,

        @Size(max = 10000, message = "Full description must not exceed 10000 characters")
        String fullDescription,

        @Size(max = 255, message = "Location must not exceed 255 characters")
        String location,

        @NotBlank(message = "Project type is required")
        @Size(max = 100, message = "Project type must not exceed 100 characters")
        String projectType,

        @NotNull(message = "Status is required")
        PortfolioProjectStatus status,

        @NotNull(message = "Featured flag is required")
        Boolean featured,

        @NotNull(message = "Display order is required")
        Integer displayOrder,

        @Size(max = 500, message = "Cover image URL must not exceed 500 characters")
        String coverImageUrl,

        LocalDate completedAt
) {
}