package com.example.architectureplatform.consultation.exception;

import com.example.architectureplatform.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ConsultationExceptionHandler {
    @ExceptionHandler(ConsultationRequestNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleConsultationRequestNotFound(
            ConsultationRequestNotFoundException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }
}
