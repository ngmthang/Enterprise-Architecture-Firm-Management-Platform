package com.example.architectureplatform.company.exception;

import com.example.architectureplatform.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CompanyExceptionHandler {

    @ExceptionHandler(CompanyProfileNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleCompanyProfileNotFound(
            CompanyProfileNotFoundException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(CompanyProfileAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleCompanyProfileAlreadyExists(
            CompanyProfileAlreadyExistsException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }
}