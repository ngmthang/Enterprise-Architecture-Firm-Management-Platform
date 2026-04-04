package com.example.architectureplatform.invoice.dto.response;

import com.example.architectureplatform.invoice.enums.InvoiceStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record InvoiceResponse(
        Long id,
        String code,
        Long projectId,
        String projectCode,
        Long contractId,
        String contractCode,
        String title,
        InvoiceStatus status,
        LocalDate invoiceDate,
        LocalDate dueDate,
        LocalDate paidDate,
        String currency,
        BigDecimal subtotalAmount,
        BigDecimal taxAmount,
        BigDecimal discountAmount,
        BigDecimal totalAmount,
        BigDecimal amountPaid,
        BigDecimal balanceDue,
        String clientName,
        String clientEmail,
        String clientPhone,
        String documentUrl,
        String description,
        String notes,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}