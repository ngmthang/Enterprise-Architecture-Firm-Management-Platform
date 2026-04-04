package com.example.architectureplatform.report.exception;

import com.example.architectureplatform.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.example.architectureplatform.report")
public class ReportExceptionHandler {

    @ExceptionHandler(ReportNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleReportNotFound(ReportNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(InvalidReportPeriodException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidReportPeriod(InvalidReportPeriodException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }
}