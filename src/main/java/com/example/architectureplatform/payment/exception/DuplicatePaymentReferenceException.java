package com.example.architectureplatform.payment.exception;

public class DuplicatePaymentReferenceException extends RuntimeException {

    public DuplicatePaymentReferenceException(String paymentReference) {
        super("Payment reference already exists: " + paymentReference);
    }
}