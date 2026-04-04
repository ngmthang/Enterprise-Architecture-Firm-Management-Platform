package com.example.architectureplatform.service_catalog.exception;

import com.example.architectureplatform.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ServiceCatalogExceptionHandler {

    @ExceptionHandler(ServiceOfferingNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleServiceOfferingNotFound(
            ServiceOfferingNotFoundException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(ServiceOfferingSlugAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleServiceOfferingSlugAlreadyExists(
            ServiceOfferingSlugAlreadyExistsException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }
}