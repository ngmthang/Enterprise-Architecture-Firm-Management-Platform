package com.example.architectureplatform.notification.service;

import com.example.architectureplatform.notification.dto.request.CreateNotificationRequest;
import com.example.architectureplatform.notification.dto.request.MarkNotificationAsReadRequest;
import com.example.architectureplatform.notification.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(CreateNotificationRequest request);

    NotificationResponse getNotificationById(Long notificationId);

    List<NotificationResponse> getAllNotifications();

    List<NotificationResponse> getNotificationsByUserId(Long userId);

    List<NotificationResponse> getUnreadNotificationsByUserId(Long userId);

    NotificationResponse markNotificationAsRead(Long notificationId, MarkNotificationAsReadRequest request);
}