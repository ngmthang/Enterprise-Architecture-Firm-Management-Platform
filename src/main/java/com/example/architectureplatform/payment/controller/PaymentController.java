package com.example.architectureplatform.payment.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.payment.dto.request.CreatePaymentRequest;
import com.example.architectureplatform.payment.dto.request.UpdatePaymentStatusRequest;
import com.example.architectureplatform.payment.dto.response.PaymentResponse;
import com.example.architectureplatform.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @Valid @RequestBody CreatePaymentRequest request
    ) {
        PaymentResponse response = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment created successfully", response));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long paymentId) {
        PaymentResponse response = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
        List<PaymentResponse> response = paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", response));
    }

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByInvoiceId(@PathVariable Long invoiceId) {
        List<PaymentResponse> response = paymentService.getPaymentsByInvoiceId(invoiceId);
        return ResponseEntity.ok(ApiResponse.success("Payments by invoice retrieved successfully", response));
    }

    @PatchMapping("/{paymentId}/status")
    public ResponseEntity<ApiResponse<PaymentResponse>> updatePaymentStatus(
            @PathVariable Long paymentId,
            @Valid @RequestBody UpdatePaymentStatusRequest request
    ) {
        PaymentResponse response = paymentService.updatePaymentStatus(paymentId, request);
        return ResponseEntity.ok(ApiResponse.success("Payment status updated successfully", response));
    }
}