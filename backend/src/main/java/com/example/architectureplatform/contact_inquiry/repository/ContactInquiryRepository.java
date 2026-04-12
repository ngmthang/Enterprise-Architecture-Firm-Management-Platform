package com.example.architectureplatform.contact_inquiry.repository;

import com.example.architectureplatform.contact_inquiry.entity.ContactInquiry;
import com.example.architectureplatform.contact_inquiry.enums.ContactInquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, Long> {
    List<ContactInquiry> findAllByOrderByCreatedAtDesc();
    List<ContactInquiry> findByStatusOrderByCreatedAtDesc(ContactInquiryStatus status);
}