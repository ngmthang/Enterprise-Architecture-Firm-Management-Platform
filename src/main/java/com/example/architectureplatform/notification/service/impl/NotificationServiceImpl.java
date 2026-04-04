package com.example.architectureplatform.notification.service.impl;

import com.example.architectureplatform.notification.dto.request.CreateNotificationRequest;
import com.example.architectureplatform.notification.dto.request.MarkNotificationAsReadRequest;
import com.example.architectureplatform.notification.dto.response.NotificationResponse;
import com.example.architectureplatform.notification.entity.Notification;
import com.example.architectureplatform.notification.exception.NotificationNotFoundException;
import com.example.architectureplatform.notification.exception.UserNotFoundForNotificationException;
import com.example.architectureplatform.notification.mapper.NotificationMapper;
import com.example.architectureplatform.notification.repository.NotificationRepository;
import com.example.architectureplatform.notification.service.NotificationService;
import com.example.architectureplatform.user.entity.User;
import com.example.architectureplatform.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            NotificationMapper notificationMapper
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new UserNotFoundForNotificationException(request.userId()));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(request.title().trim());
        notification.setMessage(request.message().trim());
        notification.setType(request.type());
        notification.setRead(false);
        notification.setReadAt(null);

        Notification savedNotification = notificationRepository.save(notification);
        return notificationMapper.toResponse(savedNotification);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));

        return notificationMapper.toResponse(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundForNotificationException(userId);
        }

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotificationsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundForNotificationException(userId);
        }

        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    public NotificationResponse markNotificationAsRead(Long notificationId, MarkNotificationAsReadRequest request) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));

        notification.setRead(request.read());

        if (Boolean.TRUE.equals(request.read())) {
            notification.setReadAt(LocalDateTime.now());
        } else {
            notification.setReadAt(null);
        }

        Notification updatedNotification = notificationRepository.save(notification);
        return notificationMapper.toResponse(updatedNotification);
    }
}