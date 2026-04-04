package com.example.architectureplatform.project_document.exception;

import com.example.architectureplatform.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ProjectDocumentExceptionHandler {

    @ExceptionHandler(ProjectDocumentNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleProjectDocumentNotFound(ProjectDocumentNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(ProjectDocumentAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleProjectDocumentAlreadyExists(ProjectDocumentAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(exception.getMessage()));
    }
}