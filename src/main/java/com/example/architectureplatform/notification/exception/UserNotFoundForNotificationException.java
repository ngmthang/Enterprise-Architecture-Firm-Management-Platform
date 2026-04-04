package com.example.architectureplatform.notification.exception;

public class UserNotFoundForNotificationException extends RuntimeException {

    public UserNotFoundForNotificationException(Long userId) {
        super("User not found for notification with id: " + userId);
    }
}