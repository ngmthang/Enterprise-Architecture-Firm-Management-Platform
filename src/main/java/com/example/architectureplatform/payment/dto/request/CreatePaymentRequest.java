package com.example.architectureplatform.payment.dto.request;

import com.example.architectureplatform.payment.enums.PaymentMethod;
import com.example.architectureplatform.payment.enums.PaymentStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreatePaymentRequest(
        @NotNull(message = "Invoice id is required")
        Long invoiceId,

        @Size(max = 100, message = "Payment reference must not exceed 100 characters")
        String paymentReference,

        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod,

        @NotNull(message = "Payment status is required")
        PaymentStatus paymentStatus,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        @Digits(integer = 10, fraction = 2, message = "Amount format is invalid")
        BigDecimal amount,

        @NotBlank(message = "Currency is required")
        @Size(max = 10, message = "Currency must not exceed 10 characters")
        String currency,

        LocalDateTime paidAt,

        @Size(max = 5000, message = "Notes must not exceed 5000 characters")
        String notes
) {
}