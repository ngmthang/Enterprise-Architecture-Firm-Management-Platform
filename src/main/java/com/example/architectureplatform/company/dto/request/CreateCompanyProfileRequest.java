package com.example.architectureplatform.company.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCompanyProfileRequest(

        @NotBlank(message = "Company name is required")
        @Size(max = 200, message = "Company name must not exceed 200 characters")
        String companyName,

        @Size(max = 255, message = "Tagline must not exceed 255 characters")
        String tagline,

        @Size(max = 500, message = "Short description must not exceed 500 characters")
        String shortDescription,

        @Size(max = 10000, message = "Full description must not exceed 10000 characters")
        String fullDescription,

        @Email(message = "Email format is invalid")
        @Size(max = 150, message = "Email must not exceed 150 characters")
        String email,

        @Size(max = 30, message = "Phone must not exceed 30 characters")
        String phone,

        @Size(max = 255, message = "Address line 1 must not exceed 255 characters")
        String addressLine1,

        @Size(max = 255, message = "Address line 2 must not exceed 255 characters")
        String addressLine2,

        @Size(max = 100, message = "City must not exceed 100 characters")
        String city,

        @Size(max = 100, message = "State must not exceed 100 characters")
        String state,

        @Size(max = 30, message = "Postal code must not exceed 30 characters")
        String postalCode,

        @Size(max = 100, message = "Country must not exceed 100 characters")
        String country,

        @Size(max = 500, message = "Website URL must not exceed 500 characters")
        String websiteUrl,

        @Size(max = 500, message = "Facebook URL must not exceed 500 characters")
        String facebookUrl,

        @Size(max = 500, message = "Instagram URL must not exceed 500 characters")
        String instagramUrl,

        @Size(max = 500, message = "LinkedIn URL must not exceed 500 characters")
        String linkedinUrl
) {
}