package com.example.architectureplatform.company.mapper;

import com.example.architectureplatform.company.dto.request.CreateCompanyProfileRequest;
import com.example.architectureplatform.company.dto.response.CompanyProfileResponse;
import com.example.architectureplatform.company.entity.CompanyProfile;
import org.springframework.stereotype.Component;

@Component
public class CompanyProfileMapper {

    public CompanyProfile toEntity(CreateCompanyProfileRequest request) {
        CompanyProfile companyProfile = new CompanyProfile();
        companyProfile.setCompanyName(request.companyName());
        companyProfile.setTagline(request.tagline());
        companyProfile.setShortDescription(request.shortDescription());
        companyProfile.setFullDescription(request.fullDescription());
        companyProfile.setEmail(request.email());
        companyProfile.setPhone(request.phone());
        companyProfile.setAddressLine1(request.addressLine1());
        companyProfile.setAddressLine2(request.addressLine2());
        companyProfile.setCity(request.city());
        companyProfile.setState(request.state());
        companyProfile.setPostalCode(request.postalCode());
        companyProfile.setCountry(request.country());
        companyProfile.setWebsiteUrl(request.websiteUrl());
        companyProfile.setFacebookUrl(request.facebookUrl());
        companyProfile.setInstagramUrl(request.instagramUrl());
        companyProfile.setLinkedinUrl(request.linkedinUrl());
        return companyProfile;
    }

    public CompanyProfileResponse toResponse(CompanyProfile companyProfile) {
        return new CompanyProfileResponse(
                companyProfile.getId(),
                companyProfile.getCompanyName(),
                companyProfile.getTagline(),
                companyProfile.getShortDescription(),
                companyProfile.getFullDescription(),
                companyProfile.getEmail(),
                companyProfile.getPhone(),
                companyProfile.getAddressLine1(),
                companyProfile.getAddressLine2(),
                companyProfile.getCity(),
                companyProfile.getState(),
                companyProfile.getPostalCode(),
                companyProfile.getCountry(),
                companyProfile.getWebsiteUrl(),
                companyProfile.getFacebookUrl(),
                companyProfile.getInstagramUrl(),
                companyProfile.getLinkedinUrl(),
                companyProfile.getCreatedAt(),
                companyProfile.getUpdatedAt()
        );
    }
}