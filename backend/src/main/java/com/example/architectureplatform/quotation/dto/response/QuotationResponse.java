package com.example.architectureplatform.quotation.dto.response;

import com.example.architectureplatform.quotation.enums.QuotationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record QuotationResponse(
        Long id,
        String code,
        Long projectId,
        String projectCode,
        Long consultationId,
        String title,
        QuotationStatus status,
        String currency,
        BigDecimal subtotalAmount,
        BigDecimal taxAmount,
        BigDecimal discountAmount,
        BigDecimal totalAmount,
        LocalDate issueDate,
        LocalDate validUntil,
        String clientName,
        String clientEmail,
        String clientPhone,
        String scopeSummary,
        String termsAndConditions,
        String notes,
        String publicToken,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}