package com.example.architectureplatform.contact_inquiry.mapper;

import com.example.architectureplatform.contact_inquiry.dto.request.CreateContactInquiryRequest;
import com.example.architectureplatform.contact_inquiry.dto.response.ContactInquiryResponse;
import com.example.architectureplatform.contact_inquiry.entity.ContactInquiry;
import org.springframework.stereotype.Component;

@Component
public class ContactInquiryMapper {

    public ContactInquiry toEntity(CreateContactInquiryRequest request) {
        ContactInquiry contactInquiry = new ContactInquiry();
        contactInquiry.setFullName(request.fullName());
        contactInquiry.setEmail(request.email());
        contactInquiry.setPhone(request.phone());
        contactInquiry.setSubject(request.subject());
        contactInquiry.setMessage(request.message());
        return contactInquiry;
    }

    public ContactInquiryResponse toResponse(ContactInquiry contactInquiry) {
        return new ContactInquiryResponse(
                contactInquiry.getId(),
                contactInquiry.getFullName(),
                contactInquiry.getEmail(),
                contactInquiry.getPhone(),
                contactInquiry.getSubject(),
                contactInquiry.getMessage(),
                contactInquiry.getStatus(),
                contactInquiry.getCreatedAt(),
                contactInquiry.getUpdatedAt()
        );
    }
}