package com.example.architectureplatform.user.mapper;

import com.example.architectureplatform.user.dto.response.UserResponse;
import com.example.architectureplatform.user.entity.User;
import com.example.architectureplatform.user.entity.Role;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        Set<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.isEnabled(),
                user.isEmailVerified(),
                roles,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
