package com.example.architectureplatform.user.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.security.annotation.AdminOnly;
import com.example.architectureplatform.user.dto.response.UserResponse;
import com.example.architectureplatform.user.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @AdminOnly
    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ApiResponse.success("Request Success", users);
    }
}
