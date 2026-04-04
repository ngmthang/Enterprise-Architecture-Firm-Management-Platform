package com.example.architectureplatform.company.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.company.dto.request.CreateCompanyProfileRequest;
import com.example.architectureplatform.company.dto.request.UpdateCompanyProfileRequest;
import com.example.architectureplatform.company.dto.response.CompanyProfileResponse;
import com.example.architectureplatform.company.service.CompanyProfileService;
import com.example.architectureplatform.security.annotation.AdminOnly;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/company-profile")
public class CompanyProfileController {

    private final CompanyProfileService companyProfileService;

    public CompanyProfileController(CompanyProfileService companyProfileService) {
        this.companyProfileService = companyProfileService;
    }

    @GetMapping
    public ApiResponse<CompanyProfileResponse> getCompanyProfile() {
        CompanyProfileResponse response = companyProfileService.getCompanyProfile();
        return ApiResponse.success("Company profile fetched successfully", response);
    }

    @AdminOnly
    @PostMapping
    public ApiResponse<CompanyProfileResponse> createCompanyProfile(
            @Valid @RequestBody CreateCompanyProfileRequest request
    ) {
        CompanyProfileResponse response = companyProfileService.createCompanyProfile(request);
        return ApiResponse.success("Company profile created successfully", response);
    }

    @AdminOnly
    @PutMapping
    public ApiResponse<CompanyProfileResponse> updateCompanyProfile(
            @Valid @RequestBody UpdateCompanyProfileRequest request
    ) {
        CompanyProfileResponse response = companyProfileService.updateCompanyProfile(request);
        return ApiResponse.success("Company profile updated successfully", response);
    }
}