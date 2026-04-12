package com.example.architectureplatform.contact_inquiry.dto.response;

import com.example.architectureplatform.contact_inquiry.enums.ContactInquiryStatus;

import java.time.LocalDateTime;

public record ContactInquiryResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String subject,
        String message,
        ContactInquiryStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}