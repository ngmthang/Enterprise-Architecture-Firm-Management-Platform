package com.example.architectureplatform.project.dto.response;

import com.example.architectureplatform.project.enums.ProjectStatus;
import com.example.architectureplatform.project.enums.ProjectType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProjectResponse(
        Long id,
        String code,
        String name,
        ProjectType projectType,
        ProjectStatus status,
        String clientName,
        String clientEmail,
        String clientPhone,
        String location,
        BigDecimal areaSizeSqft,
        BigDecimal estimatedBudget,
        LocalDate startDate,
        LocalDate targetEndDate,
        LocalDate actualEndDate,
        String description,
        String notes,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}