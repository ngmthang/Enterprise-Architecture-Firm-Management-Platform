package com.example.architectureplatform.contact_inquiry.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.contact_inquiry.dto.request.CreateContactInquiryRequest;
import com.example.architectureplatform.contact_inquiry.dto.request.UpdateContactInquiryRequest;
import com.example.architectureplatform.contact_inquiry.dto.request.UpdateContactInquiryStatusRequest;
import com.example.architectureplatform.contact_inquiry.dto.response.ContactInquiryResponse;
import com.example.architectureplatform.contact_inquiry.enums.ContactInquiryStatus;
import com.example.architectureplatform.contact_inquiry.service.ContactInquiryService;
import com.example.architectureplatform.security.annotation.AdminOnly;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contact-inquiries")
public class ContactInquiryController {

    private final ContactInquiryService contactInquiryService;

    public ContactInquiryController(ContactInquiryService contactInquiryService) {
        this.contactInquiryService = contactInquiryService;
    }

    @PostMapping
    public ApiResponse<ContactInquiryResponse> createContactInquiry(
            @Valid @RequestBody CreateContactInquiryRequest request
    ) {
        ContactInquiryResponse response = contactInquiryService.createContactInquiry(request);
        return ApiResponse.success("Contact inquiry submitted successfully", response);
    }

    @AdminOnly
    @GetMapping
    public ApiResponse<List<ContactInquiryResponse>> getAllContactInquiries(
            @RequestParam(required = false) ContactInquiryStatus status
    ) {
        List<ContactInquiryResponse> responses;

        if (status != null) {
            responses = contactInquiryService.getContactInquiriesByStatus(status);
        } else {
            responses = contactInquiryService.getAllContactInquiries();
        }

        return ApiResponse.success("Contact inquiries fetched successfully", responses);
    }

    @AdminOnly
    @GetMapping("/{contactInquiryId}")
    public ApiResponse<ContactInquiryResponse> getContactInquiryById(
            @PathVariable Long contactInquiryId
    ) {
        ContactInquiryResponse response = contactInquiryService.getContactInquiryById(contactInquiryId);
        return ApiResponse.success("Contact inquiry fetched successfully", response);
    }

    @AdminOnly
    @PutMapping("/{contactInquiryId}")
    public ApiResponse<ContactInquiryResponse> updateContactInquiry(
            @PathVariable Long contactInquiryId,
            @Valid @RequestBody UpdateContactInquiryRequest request
    ) {
        ContactInquiryResponse response =
                contactInquiryService.updateContactInquiry(contactInquiryId, request);

        return ApiResponse.success("Contact inquiry updated successfully", response);
    }

    @AdminOnly
    @PatchMapping("/{contactInquiryId}/status")
    public ApiResponse<ContactInquiryResponse> updateContactInquiryStatus(
            @PathVariable Long contactInquiryId,
            @Valid @RequestBody UpdateContactInquiryStatusRequest request
    ) {
        ContactInquiryResponse response =
                contactInquiryService.updateContactInquiryStatus(contactInquiryId, request);

        return ApiResponse.success("Contact inquiry status updated successfully", response);
    }
}