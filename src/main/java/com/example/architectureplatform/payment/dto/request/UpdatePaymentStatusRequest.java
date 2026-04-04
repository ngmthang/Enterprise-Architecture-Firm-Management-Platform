package com.example.architectureplatform.payment.dto.request;

import com.example.architectureplatform.payment.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record UpdatePaymentStatusRequest(
        @NotNull(message = "Payment status is required")
        PaymentStatus paymentStatus,

        LocalDateTime paidAt
) {
}