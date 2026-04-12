package com.example.architectureplatform.consultation.dto.response;

import com.example.architectureplatform.consultation.enums.ConsultationRequestStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ConsultationRequestResponse(
        Long id,
        String fullname,
        String email,
        String phone,
        String projectType,
        String projectLocation,
        String projectBudget,
        String preferredContactMethod,
        String projectDetails,
        ConsultationRequestStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
