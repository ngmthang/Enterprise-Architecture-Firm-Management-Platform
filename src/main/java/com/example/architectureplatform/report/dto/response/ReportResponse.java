package com.example.architectureplatform.report.dto.response;

import com.example.architectureplatform.report.enums.ReportType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReportResponse(
        Long id,
        String name,
        String description,
        ReportType reportType,
        String generatedBy,
        LocalDate reportPeriodStart,
        LocalDate reportPeriodEnd,
        LocalDateTime generatedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}