package com.example.architectureplatform.contract.dto.response;

import com.example.architectureplatform.contract.enums.ContractStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ContractResponse(
        Long id,
        String code,
        Long projectId,
        String projectCode,
        Long quotationId,
        String quotationCode,
        String title,
        ContractStatus status,
        LocalDate contractDate,
        LocalDate startDate,
        LocalDate endDate,
        boolean signedByClient,
        boolean signedByCompany,
        LocalDateTime signedAt,
        String clientName,
        String clientEmail,
        String clientPhone,
        BigDecimal contractValue,
        String currency,
        String documentUrl,
        String scopeSummary,
        String termsAndConditions,
        String notes,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}