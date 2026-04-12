package com.example.architectureplatform.auth.controller;

import com.example.architectureplatform.auth.dto.request.AuthRequest;
import com.example.architectureplatform.auth.dto.response.AuthResponse;
import com.example.architectureplatform.auth.service.AuthService;
import com.example.architectureplatform.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ApiResponse.success("Login successful", response);
    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse> getCurrentUser() {
        AuthResponse response = authService.getCurrentUser();
        return ApiResponse.success("Current user fetched successfully", response);
    }
}