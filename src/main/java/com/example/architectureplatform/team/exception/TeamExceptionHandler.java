package com.example.architectureplatform.team.exception;

import com.example.architectureplatform.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TeamExceptionHandler {

    @ExceptionHandler(TeamMemberNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleTeamMemberNotFound(
            TeamMemberNotFoundException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(TeamMemberAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleTeamMemberAlreadyExists(
            TeamMemberAlreadyExistsException ex
    ) {
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }
}