package com.example.architectureplatform.portfolio.exception;

import com.example.architectureplatform.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class PortfolioExceptionHandler {

    @ExceptionHandler(PortfolioProjectNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handlePortfolioProjectNotFound(
            PortfolioProjectNotFoundException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(PortfolioProjectNotFoundByIdException.class)
    public ResponseEntity<ApiResponse<Void>> handlePortfolioProjectNotFoundById(
            PortfolioProjectNotFoundByIdException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(PortfolioProjectSlugAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handlePortfolioProjectSlugAlreadyExists(
            PortfolioProjectSlugAlreadyExistsException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }
}