package com.example.architectureplatform.quotation.dto.request;

import com.example.architectureplatform.quotation.enums.QuotationStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateQuotationRequest(

        Long projectId,

        Long consultationId,

        @NotBlank(message = "Quotation title is required")
        @Size(max = 255, message = "Quotation title must not exceed 255 characters")
        String title,

        @NotNull(message = "Quotation status is required")
        QuotationStatus status,

        @NotBlank(message = "Currency is required")
        @Size(max = 10, message = "Currency must not exceed 10 characters")
        String currency,

        @DecimalMin(value = "0.0", inclusive = true, message = "Subtotal amount must be non-negative")
        BigDecimal subtotalAmount,

        @DecimalMin(value = "0.0", inclusive = true, message = "Tax amount must be non-negative")
        BigDecimal taxAmount,

        @DecimalMin(value = "0.0", inclusive = true, message = "Discount amount must be non-negative")
        BigDecimal discountAmount,

        @DecimalMin(value = "0.0", inclusive = true, message = "Total amount must be non-negative")
        BigDecimal totalAmount,

        LocalDate issueDate,
        LocalDate validUntil,

        @NotBlank(message = "Client name is required")
        @Size(max = 255, message = "Client name must not exceed 255 characters")
        String clientName,

        @Email(message = "Client email must be a valid email address")
        @Size(max = 255, message = "Client email must not exceed 255 characters")
        String clientEmail,

        @Size(max = 50, message = "Client phone must not exceed 50 characters")
        String clientPhone,

        String scopeSummary,
        String termsAndConditions,
        String notes,
        Boolean active
) {
}