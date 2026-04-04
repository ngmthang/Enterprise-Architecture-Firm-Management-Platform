package com.example.architectureplatform.notification.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.notification.dto.request.CreateNotificationRequest;
import com.example.architectureplatform.notification.dto.request.MarkNotificationAsReadRequest;
import com.example.architectureplatform.notification.dto.response.NotificationResponse;
import com.example.architectureplatform.notification.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
            @Valid @RequestBody CreateNotificationRequest request
    ) {
        NotificationResponse response = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Notification created successfully", response));
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotificationById(@PathVariable Long notificationId) {
        NotificationResponse response = notificationService.getNotificationById(notificationId);
        return ResponseEntity.ok(ApiResponse.success("Notification retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getAllNotifications() {
        List<NotificationResponse> response = notificationService.getAllNotifications();
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", response));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotificationsByUserId(@PathVariable Long userId) {
        List<NotificationResponse> response = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("User notifications retrieved successfully", response));
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnreadNotificationsByUserId(@PathVariable Long userId) {
        List<NotificationResponse> response = notificationService.getUnreadNotificationsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Unread notifications retrieved successfully", response));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markNotificationAsRead(
            @PathVariable Long notificationId,
            @Valid @RequestBody MarkNotificationAsReadRequest request
    ) {
        NotificationResponse response = notificationService.markNotificationAsRead(notificationId, request);
        return ResponseEntity.ok(ApiResponse.success("Notification read status updated successfully", response));
    }
}