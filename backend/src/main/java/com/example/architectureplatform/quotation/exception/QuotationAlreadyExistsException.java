package com.example.architectureplatform.quotation.exception;

public class QuotationAlreadyExistsException extends RuntimeException {

    public QuotationAlreadyExistsException(String code) {
        super("Quotation already exists with code: " + code);
    }
}