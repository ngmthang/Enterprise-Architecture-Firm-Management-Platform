package com.example.architectureplatform.invoice.exception;

import com.example.architectureplatform.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class InvoiceExceptionHandler {

    @ExceptionHandler(InvoiceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvoiceNotFound(InvoiceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(InvoiceAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvoiceAlreadyExists(InvoiceAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(exception.getMessage()));
    }
}