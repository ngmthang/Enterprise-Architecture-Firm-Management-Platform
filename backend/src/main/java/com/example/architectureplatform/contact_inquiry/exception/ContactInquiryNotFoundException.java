package com.example.architectureplatform.contact_inquiry.exception;

public class ContactInquiryNotFoundException extends RuntimeException {

    public ContactInquiryNotFoundException(Long id) {
        super("Contact inquiry not found with id: " + id);
    }
}