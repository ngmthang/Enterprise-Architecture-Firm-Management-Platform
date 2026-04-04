package com.example.architectureplatform.invoice.exception;

public class InvoiceNotFoundException extends RuntimeException {

    public InvoiceNotFoundException(Long id) {
        super("Invoice not found with id: " + id);
    }

    public InvoiceNotFoundException(String code) {
        super("Invoice not found with code: " + code);
    }
}