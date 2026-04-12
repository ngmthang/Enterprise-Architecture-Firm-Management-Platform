package com.example.architectureplatform.contact_inquiry.service;

import com.example.architectureplatform.contact_inquiry.dto.request.CreateContactInquiryRequest;
import com.example.architectureplatform.contact_inquiry.dto.request.UpdateContactInquiryRequest;
import com.example.architectureplatform.contact_inquiry.dto.request.UpdateContactInquiryStatusRequest;
import com.example.architectureplatform.contact_inquiry.dto.response.ContactInquiryResponse;
import com.example.architectureplatform.contact_inquiry.entity.ContactInquiry;
import com.example.architectureplatform.contact_inquiry.enums.ContactInquiryStatus;
import com.example.architectureplatform.contact_inquiry.exception.ContactInquiryNotFoundException;
import com.example.architectureplatform.contact_inquiry.mapper.ContactInquiryMapper;
import com.example.architectureplatform.contact_inquiry.repository.ContactInquiryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactInquiryService {

    private final ContactInquiryRepository contactInquiryRepository;
    private final ContactInquiryMapper contactInquiryMapper;

    public ContactInquiryService(
            ContactInquiryRepository contactInquiryRepository,
            ContactInquiryMapper contactInquiryMapper
    ) {
        this.contactInquiryRepository = contactInquiryRepository;
        this.contactInquiryMapper = contactInquiryMapper;
    }

    @Transactional
    public ContactInquiryResponse createContactInquiry(CreateContactInquiryRequest request) {
        ContactInquiry contactInquiry = contactInquiryMapper.toEntity(request);
        ContactInquiry savedContactInquiry = contactInquiryRepository.save(contactInquiry);
        return contactInquiryMapper.toResponse(savedContactInquiry);
    }

    @Transactional(readOnly = true)
    public List<ContactInquiryResponse> getAllContactInquiries() {
        return contactInquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(contactInquiryMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContactInquiryResponse> getContactInquiriesByStatus(ContactInquiryStatus status) {
        return contactInquiryRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(contactInquiryMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ContactInquiryResponse getContactInquiryById(Long contactInquiryId) {
        ContactInquiry contactInquiry = contactInquiryRepository.findById(contactInquiryId)
                .orElseThrow(() -> new ContactInquiryNotFoundException(contactInquiryId));

        return contactInquiryMapper.toResponse(contactInquiry);
    }

    @Transactional
    public ContactInquiryResponse updateContactInquiry(
            Long contactInquiryId,
            UpdateContactInquiryRequest request
    ) {
        ContactInquiry contactInquiry = contactInquiryRepository.findById(contactInquiryId)
                .orElseThrow(() -> new ContactInquiryNotFoundException(contactInquiryId));

        contactInquiry.setFullName(request.fullName());
        contactInquiry.setEmail(request.email());
        contactInquiry.setPhone(request.phone());
        contactInquiry.setSubject(request.subject());
        contactInquiry.setMessage(request.message());

        if (request.status() != null) {
            contactInquiry.setStatus(request.status());
        }

        ContactInquiry updatedContactInquiry = contactInquiryRepository.save(contactInquiry);
        return contactInquiryMapper.toResponse(updatedContactInquiry);
    }

    @Transactional
    public ContactInquiryResponse updateContactInquiryStatus(
            Long contactInquiryId,
            UpdateContactInquiryStatusRequest request
    ) {
        ContactInquiry contactInquiry = contactInquiryRepository.findById(contactInquiryId)
                .orElseThrow(() -> new ContactInquiryNotFoundException(contactInquiryId));

        contactInquiry.setStatus(request.status());

        ContactInquiry updatedContactInquiry = contactInquiryRepository.save(contactInquiry);
        return contactInquiryMapper.toResponse(updatedContactInquiry);
    }
}