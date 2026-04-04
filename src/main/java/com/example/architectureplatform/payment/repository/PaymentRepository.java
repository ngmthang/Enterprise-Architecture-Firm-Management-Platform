package com.example.architectureplatform.payment.repository;

import com.example.architectureplatform.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByInvoiceIdOrderByCreatedAtDesc(Long invoiceId);

    Optional<Payment> findByPaymentReference(String paymentReference);

    boolean existsByPaymentReference(String paymentReference);
}