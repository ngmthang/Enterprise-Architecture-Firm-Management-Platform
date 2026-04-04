package com.example.architectureplatform.invoice.exception;

public class InvoiceAlreadyExistsException extends RuntimeException {

    public InvoiceAlreadyExistsException(String code) {
        super("Invoice already exists with code: " + code);
    }
}