package com.example.architectureplatform.payment.mapper;

import com.example.architectureplatform.payment.dto.response.PaymentResponse;
import com.example.architectureplatform.payment.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getInvoice().getId(),
                payment.getPaymentReference(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getPaidAt(),
                payment.getNotes(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}