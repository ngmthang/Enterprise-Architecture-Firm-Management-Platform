package com.example.architectureplatform.notification.dto.request;

import jakarta.validation.constraints.NotNull;

public record MarkNotificationAsReadRequest(
        @NotNull(message = "Read status is required")
        Boolean read
) {
}