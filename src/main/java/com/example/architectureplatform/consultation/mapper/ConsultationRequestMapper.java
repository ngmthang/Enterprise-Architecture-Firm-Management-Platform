package com.example.architectureplatform.consultation.mapper;

import com.example.architectureplatform.consultation.dto.response.ConsultationRequestResponse;
import com.example.architectureplatform.consultation.dto.request.CreateConsultationRequest;
import com.example.architectureplatform.consultation.entity.ConsultationRequest;
import org.springframework.stereotype.Component;

@Component
public class ConsultationRequestMapper {
    public ConsultationRequest toEntity(CreateConsultationRequest request) {
        ConsultationRequest consultationRequest = new ConsultationRequest();
        consultationRequest.setFullName(request.fullname());
        consultationRequest.setEmail(request.email());
        consultationRequest.setPhone(request.phone());
        consultationRequest.setProjectType(request.projectType());
        consultationRequest.setProjectLocation(request.projectLocation());
        consultationRequest.setProjectBudget(request.projectBudget());
        consultationRequest.setPreferredContactMethod(request.preferredContactMethod());
        consultationRequest.setProjectDetails(request.projectDetails());
        return consultationRequest;
    }

    public ConsultationRequestResponse toResponse(ConsultationRequest request) {
        return new ConsultationRequestResponse(
                request.getId(),
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getProjectType(),
                request.getProjectLocation(),
                request.getProjectBudget(),
                request.getPreferredContactMethod(),
                request.getProjectDetails(),
                request.getStatus(),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}
