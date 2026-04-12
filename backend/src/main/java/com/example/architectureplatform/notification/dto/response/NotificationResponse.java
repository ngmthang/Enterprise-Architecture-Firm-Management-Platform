package com.example.architectureplatform.notification.dto.response;

import com.example.architectureplatform.notification.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        Long userId,
        String title,
        String message,
        NotificationType type,
        boolean read,
        LocalDateTime readAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}