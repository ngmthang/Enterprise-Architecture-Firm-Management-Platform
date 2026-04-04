package com.example.architectureplatform.service_catalog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateServiceOfferingRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 150, message = "Name must not exceed 150 characters")
        String name,

        @NotBlank(message = "Slug is required")
        @Size(max = 170, message = "Slug must not exceed 170 characters")
        String slug,

        @NotBlank(message = "Short description is required")
        @Size(max = 500, message = "Short description must not exceed 500 characters")
        String shortDescription,

        @Size(max = 10000, message = "Full description must not exceed 10000 characters")
        String fullDescription,

        @Size(max = 100, message = "Icon must not exceed 100 characters")
        String icon,

        @NotNull(message = "Featured flag is required")
        Boolean featured,

        @NotNull(message = "Display order is required")
        Integer displayOrder,

        @NotNull(message = "Active flag is required")
        Boolean active
) {
}