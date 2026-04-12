package com.example.architectureplatform.payment.exception;

public class InvoiceNotFoundForPaymentException extends RuntimeException {

    public InvoiceNotFoundForPaymentException(Long invoiceId) {
        super("Invoice not found for payment with id: " + invoiceId);
    }
}