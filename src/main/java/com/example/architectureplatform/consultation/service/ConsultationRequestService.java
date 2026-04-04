package com.example.architectureplatform.consultation.service;

import com.example.architectureplatform.consultation.dto.request.CreateConsultationRequest;
import com.example.architectureplatform.consultation.dto.request.UpdateConsultationRequest;
import com.example.architectureplatform.consultation.dto.request.UpdateConsultationRequestStatusRequest;
import com.example.architectureplatform.consultation.dto.response.ConsultationRequestResponse;
import com.example.architectureplatform.consultation.entity.ConsultationRequest;
import com.example.architectureplatform.consultation.exception.ConsultationRequestNotFoundException;
import com.example.architectureplatform.consultation.mapper.ConsultationRequestMapper;
import com.example.architectureplatform.consultation.repository.ConsultationRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConsultationRequestService {

    private final ConsultationRequestRepository consultationRequestRepository;
    private final ConsultationRequestMapper consultationRequestMapper;

    public ConsultationRequestService(
            ConsultationRequestRepository consultationRequestRepository,
            ConsultationRequestMapper consultationRequestMapper
    ) {
        this.consultationRequestRepository = consultationRequestRepository;
        this.consultationRequestMapper = consultationRequestMapper;
    }

    @Transactional
    public ConsultationRequestResponse createConsultationRequest(CreateConsultationRequest request) {
        ConsultationRequest consultationRequest = consultationRequestMapper.toEntity(request);
        ConsultationRequest savedConsultationRequest = consultationRequestRepository.save(consultationRequest);
        return consultationRequestMapper.toResponse(savedConsultationRequest);
    }

    @Transactional(readOnly = true)
    public List<ConsultationRequestResponse> getAllConsultationRequests() {
        return consultationRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(consultationRequestMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConsultationRequestResponse getConsultationRequestById(Long consultationRequestId) {
        ConsultationRequest consultationRequest = consultationRequestRepository.findById(consultationRequestId)
                .orElseThrow(() -> new ConsultationRequestNotFoundException(consultationRequestId));

        return consultationRequestMapper.toResponse(consultationRequest);
    }

    @Transactional
    public ConsultationRequestResponse updateConsultationRequest(
            Long consultationRequestId,
            UpdateConsultationRequest request
    ) {
        ConsultationRequest consultationRequest = consultationRequestRepository.findById(consultationRequestId)
                .orElseThrow(() -> new ConsultationRequestNotFoundException(consultationRequestId));

        consultationRequest.setFullName(request.fullName());
        consultationRequest.setEmail(request.email());
        consultationRequest.setPhone(request.phone());
        consultationRequest.setProjectType(request.projectType());
        consultationRequest.setProjectLocation(request.projectLocation());
        consultationRequest.setProjectBudget(request.projectBudget());
        consultationRequest.setPreferredContactMethod(request.preferredContactMethod());
        consultationRequest.setProjectDetails(request.projectDetails());
        consultationRequest.setStatus(request.status());

        ConsultationRequest updatedConsultationRequest = consultationRequestRepository.save(consultationRequest);
        return consultationRequestMapper.toResponse(updatedConsultationRequest);
    }

    @Transactional
    public ConsultationRequestResponse updateConsultationRequestStatus(
            Long consultationRequestId,
            UpdateConsultationRequestStatusRequest request
    ) {
        ConsultationRequest consultationRequest = consultationRequestRepository.findById(consultationRequestId)
                .orElseThrow(() -> new ConsultationRequestNotFoundException(consultationRequestId));

        consultationRequest.setStatus(request.status());

        ConsultationRequest updatedConsultationRequest = consultationRequestRepository.save(consultationRequest);
        return consultationRequestMapper.toResponse(updatedConsultationRequest);
    }
}