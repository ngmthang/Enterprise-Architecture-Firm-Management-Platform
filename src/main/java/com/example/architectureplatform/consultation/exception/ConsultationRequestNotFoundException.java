package com.example.architectureplatform.consultation.exception;

public class ConsultationRequestNotFoundException extends RuntimeException {
    public ConsultationRequestNotFoundException(Long consultationRequestId) {
        super("Consultation request not found with id: " + consultationRequestId);
    }
}
