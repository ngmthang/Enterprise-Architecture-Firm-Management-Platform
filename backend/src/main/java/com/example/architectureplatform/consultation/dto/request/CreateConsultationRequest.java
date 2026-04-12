package com.example.architectureplatform.consultation.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateConsultationRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 150, message = "Full name must not exceed 150 characters")
        String fullname,

        @NotBlank(message = "Email is required")
        @Email(message = "Email format is invalid")
        @Size(max = 150, message = "Email must not exceed 150 characters")
        String email,

        @Size(max = 30, message = "Phone must not exceed 30 characters")
        String phone,

        @NotBlank(message = "Project type is required")
        @Size(max = 100, message = "Project type must not exceed 100 characters")
        String projectType,

        @Size(max = 255, message = "Project location must not exceed 255 characters")
        String projectLocation,

        @Size(max = 100, message = "Project budget must not exceed 100 characters")
        String projectBudget,

        @NotBlank(message = "Preferred contact method is required")
        @Size(max = 30, message = "Preferred contact method must not exceed 30 characters")
        String preferredContactMethod,

        @NotBlank(message = "Project details is required")
        @Size(max = 5000, message = "Project details must not exceed 5000 characters")
        String projectDetails
) {
}
