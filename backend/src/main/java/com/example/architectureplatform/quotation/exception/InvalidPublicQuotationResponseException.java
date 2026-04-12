package com.example.architectureplatform.quotation.exception;

import com.example.architectureplatform.quotation.enums.QuotationStatus;

public class InvalidPublicQuotationResponseException extends RuntimeException {

    public InvalidPublicQuotationResponseException(QuotationStatus status) {
        super("Public quotation response status is not allowed: " + status +
                ". Only ACCEPTED or REJECTED are allowed.");
    }
}