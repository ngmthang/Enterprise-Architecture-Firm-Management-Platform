package com.example.architectureplatform.contact_inquiry.dto.request;

import com.example.architectureplatform.contact_inquiry.enums.ContactInquiryStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateContactInquiryRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 150, message = "Full name must not exceed 150 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        @Size(max = 150, message = "Email must not exceed 150 characters")
        String email,

        @Size(max = 30, message = "Phone must not exceed 30 characters")
        String phone,

        @NotBlank(message = "Subject is required")
        @Size(max = 200, message = "Subject must not exceed 200 characters")
        String subject,

        @NotBlank(message = "Message is required")
        String message,

        ContactInquiryStatus status
) {
}