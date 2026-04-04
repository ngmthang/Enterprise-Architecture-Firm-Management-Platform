package com.example.architectureplatform.company.service;

import com.example.architectureplatform.company.dto.request.CreateCompanyProfileRequest;
import com.example.architectureplatform.company.dto.request.UpdateCompanyProfileRequest;
import com.example.architectureplatform.company.dto.response.CompanyProfileResponse;
import com.example.architectureplatform.company.entity.CompanyProfile;
import com.example.architectureplatform.company.exception.CompanyProfileAlreadyExistsException;
import com.example.architectureplatform.company.exception.CompanyProfileNotFoundException;
import com.example.architectureplatform.company.mapper.CompanyProfileMapper;
import com.example.architectureplatform.company.repository.CompanyProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyProfileService {

    private final CompanyProfileRepository companyProfileRepository;
    private final CompanyProfileMapper companyProfileMapper;

    public CompanyProfileService(
            CompanyProfileRepository companyProfileRepository,
            CompanyProfileMapper companyProfileMapper
    ) {
        this.companyProfileRepository = companyProfileRepository;
        this.companyProfileMapper = companyProfileMapper;
    }

    @Transactional
    public CompanyProfileResponse createCompanyProfile(CreateCompanyProfileRequest request) {
        if (companyProfileRepository.count() > 0) {
            throw new CompanyProfileAlreadyExistsException();
        }

        CompanyProfile companyProfile = companyProfileMapper.toEntity(request);
        CompanyProfile savedCompanyProfile = companyProfileRepository.save(companyProfile);
        return companyProfileMapper.toResponse(savedCompanyProfile);
    }

    @Transactional(readOnly = true)
    public CompanyProfileResponse getCompanyProfile() {
        CompanyProfile companyProfile = companyProfileRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(CompanyProfileNotFoundException::new);

        return companyProfileMapper.toResponse(companyProfile);
    }

    @Transactional
    public CompanyProfileResponse updateCompanyProfile(UpdateCompanyProfileRequest request) {
        CompanyProfile companyProfile = companyProfileRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(CompanyProfileNotFoundException::new);

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

        CompanyProfile updatedCompanyProfile = companyProfileRepository.save(companyProfile);
        return companyProfileMapper.toResponse(updatedCompanyProfile);
    }
}