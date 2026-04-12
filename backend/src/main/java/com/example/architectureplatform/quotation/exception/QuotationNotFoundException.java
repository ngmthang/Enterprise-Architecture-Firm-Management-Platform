package com.example.architectureplatform.quotation.exception;

public class QuotationNotFoundException extends RuntimeException {

    public QuotationNotFoundException(Long id) {
        super("Quotation not found with id: " + id);
    }

    public QuotationNotFoundException(String code) {
        super("Quotation not found with code: " + code);
    }

    public QuotationNotFoundException(String value, boolean publicToken) {
        super(publicToken
                ? "Quotation not found with public token: " + value
                : "Quotation not found with code: " + value);
    }
}