package com.example.architectureplatform.project.dto.request;

import com.example.architectureplatform.project.enums.ProjectStatus;
import com.example.architectureplatform.project.enums.ProjectType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateProjectRequest(

        @NotBlank(message = "Project code is required")
        @Size(max = 50, message = "Project code must not exceed 50 characters")
        String code,

        @NotBlank(message = "Project name is required")
        @Size(max = 255, message = "Project name must not exceed 255 characters")
        String name,

        @NotNull(message = "Project type is required")
        ProjectType projectType,

        ProjectStatus status,

        @NotBlank(message = "Client name is required")
        @Size(max = 255, message = "Client name must not exceed 255 characters")
        String clientName,

        @Email(message = "Client email must be a valid email address")
        @Size(max = 255, message = "Client email must not exceed 255 characters")
        String clientEmail,

        @Size(max = 50, message = "Client phone must not exceed 50 characters")
        String clientPhone,

        @Size(max = 255, message = "Location must not exceed 255 characters")
        String location,

        @DecimalMin(value = "0.0", inclusive = true, message = "Area size must be non-negative")
        BigDecimal areaSizeSqft,

        @DecimalMin(value = "0.0", inclusive = true, message = "Estimated budget must be non-negative")
        BigDecimal estimatedBudget,

        LocalDate startDate,
        LocalDate targetEndDate,
        LocalDate actualEndDate,

        String description,
        String notes,
        Boolean active
) {
}