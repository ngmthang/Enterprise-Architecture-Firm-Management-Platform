package com.example.architectureplatform.consultation.dto.request;

import com.example.architectureplatform.consultation.enums.ConsultationRequestStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateConsultationRequestStatusRequest(
        @NotNull(message = "Status is required")
        ConsultationRequestStatus status
) {
}
