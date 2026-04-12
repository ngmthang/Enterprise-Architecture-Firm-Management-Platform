package com.example.architectureplatform.invoice.dto.request;

import com.example.architectureplatform.invoice.enums.InvoiceStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateInvoiceRequest(

        Long projectId,

        Long contractId,

        @NotBlank(message = "Invoice title is required")
        @Size(max = 255, message = "Invoice title must not exceed 255 characters")
        String title,

        @NotNull(message = "Invoice status is required")
        InvoiceStatus status,

        LocalDate invoiceDate,
        LocalDate dueDate,
        LocalDate paidDate,

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

        @DecimalMin(value = "0.0", inclusive = true, message = "Amount paid must be non-negative")
        BigDecimal amountPaid,

        @DecimalMin(value = "0.0", inclusive = true, message = "Balance due must be non-negative")
        BigDecimal balanceDue,

        @NotBlank(message = "Client name is required")
        @Size(max = 255, message = "Client name must not exceed 255 characters")
        String clientName,

        @Email(message = "Client email must be a valid email address")
        @Size(max = 255, message = "Client email must not exceed 255 characters")
        String clientEmail,

        @Size(max = 50, message = "Client phone must not exceed 50 characters")
        String clientPhone,

        @Size(max = 1000, message = "Document URL must not exceed 1000 characters")
        String documentUrl,

        String description,
        String notes,
        Boolean active
) {
}