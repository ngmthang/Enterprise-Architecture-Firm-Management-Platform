package com.example.architectureplatform.team.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateTeamMemberRequest(

        @NotBlank(message = "Full name is required")
        @Size(max = 150, message = "Full name must not exceed 150 characters")
        String fullName,

        @NotBlank(message = "Job title is required")
        @Size(max = 150, message = "Job title must not exceed 150 characters")
        String jobTitle,

        @NotBlank(message = "Short bio is required")
        @Size(max = 500, message = "Short bio must not exceed 500 characters")
        String shortBio,

        @Size(max = 10000, message = "Full bio must not exceed 10000 characters")
        String fullBio,

        @Size(max = 500, message = "Profile image URL must not exceed 500 characters")
        String profileImageUrl,

        @Email(message = "Email format is invalid")
        @Size(max = 150, message = "Email must not exceed 150 characters")
        String email,

        @Size(max = 30, message = "Phone must not exceed 30 characters")
        String phone,

        @Size(max = 500, message = "LinkedIn URL must not exceed 500 characters")
        String linkedinUrl,

        @NotNull(message = "Display order is required")
        Integer displayOrder,

        @NotNull(message = "Featured flag is required")
        Boolean featured,

        @NotNull(message = "Active flag is required")
        Boolean active
) {
}