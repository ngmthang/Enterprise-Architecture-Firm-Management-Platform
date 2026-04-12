package com.example.architectureplatform.consultation.repository;

import com.example.architectureplatform.consultation.entity.ConsultationRequest;
import com.example.architectureplatform.consultation.enums.ConsultationRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRequestRepository
    extends JpaRepository<ConsultationRequest, Long> {
    List<ConsultationRequest> findByStatusOrderByCreatedAtDesc(ConsultationRequestStatus status);
    List<ConsultationRequest> findAllByOrderByCreatedAtDesc();
}
