package com.example.architectureplatform.payment.dto.response;

import com.example.architectureplatform.payment.enums.PaymentMethod;
import com.example.architectureplatform.payment.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long invoiceId,
        String paymentReference,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        BigDecimal amount,
        String currency,
        LocalDateTime paidAt,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}