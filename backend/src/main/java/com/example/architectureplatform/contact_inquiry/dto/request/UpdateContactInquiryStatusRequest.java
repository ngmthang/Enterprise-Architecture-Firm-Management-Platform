package com.example.architectureplatform.contact_inquiry.dto.request;

import com.example.architectureplatform.contact_inquiry.enums.ContactInquiryStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateContactInquiryStatusRequest(
        @NotNull(message = "Status is required")
        ContactInquiryStatus status
) {
}