package com.example.architectureplatform.contact_inquiry.exception;

import com.example.architectureplatform.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ContactInquiryExceptionHandler {

    @ExceptionHandler(ContactInquiryNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleContactInquiryNotFound(
            ContactInquiryNotFoundException exception
    ) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(exception.getMessage()));
    }
}