package com.example.architectureplatform.payment.service;

import com.example.architectureplatform.payment.dto.request.CreatePaymentRequest;
import com.example.architectureplatform.payment.dto.request.UpdatePaymentStatusRequest;
import com.example.architectureplatform.payment.dto.response.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(CreatePaymentRequest request);

    PaymentResponse getPaymentById(Long paymentId);

    List<PaymentResponse> getAllPayments();

    List<PaymentResponse> getPaymentsByInvoiceId(Long invoiceId);

    PaymentResponse updatePaymentStatus(Long paymentId, UpdatePaymentStatusRequest request);
}