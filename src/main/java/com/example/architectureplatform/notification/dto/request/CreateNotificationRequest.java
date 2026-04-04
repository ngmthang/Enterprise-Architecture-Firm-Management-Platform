package com.example.architectureplatform.notification.dto.request;

import com.example.architectureplatform.notification.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateNotificationRequest(
        @NotNull(message = "User id is required")
        Long userId,

        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must not exceed 255 characters")
        String title,

        @NotBlank(message = "Message is required")
        @Size(max = 5000, message = "Message must not exceed 5000 characters")
        String message,

        @NotNull(message = "Notification type is required")
        NotificationType type
) {
}