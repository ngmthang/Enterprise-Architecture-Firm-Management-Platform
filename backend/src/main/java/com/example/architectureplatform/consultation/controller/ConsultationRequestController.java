package com.example.architectureplatform.consultation.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.consultation.dto.request.CreateConsultationRequest;
import com.example.architectureplatform.consultation.dto.request.UpdateConsultationRequest;
import com.example.architectureplatform.consultation.dto.request.UpdateConsultationRequestStatusRequest;
import com.example.architectureplatform.consultation.dto.response.ConsultationRequestResponse;
import com.example.architectureplatform.consultation.service.ConsultationRequestService;
import com.example.architectureplatform.security.annotation.AdminOnly;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/consultations")
public class ConsultationRequestController {

    private final ConsultationRequestService consultationRequestService;

    public ConsultationRequestController(ConsultationRequestService consultationRequestService) {
        this.consultationRequestService = consultationRequestService;
    }

    @PostMapping
    public ApiResponse<ConsultationRequestResponse> createConsultationRequest(
            @Valid @RequestBody CreateConsultationRequest request
    ) {
        ConsultationRequestResponse response =
                consultationRequestService.createConsultationRequest(request);

        return ApiResponse.success("Consultation request submitted successfully", response);
    }

    @AdminOnly
    @GetMapping
    public ApiResponse<List<ConsultationRequestResponse>> getAllConsultationRequests() {
        List<ConsultationRequestResponse> responses =
                consultationRequestService.getAllConsultationRequests();

        return ApiResponse.success("Consultation requests fetched successfully", responses);
    }

    @AdminOnly
    @GetMapping("/{consultationRequestId}")
    public ApiResponse<ConsultationRequestResponse> getConsultationRequestById(
            @PathVariable Long consultationRequestId
    ) {
        ConsultationRequestResponse response =
                consultationRequestService.getConsultationRequestById(consultationRequestId);

        return ApiResponse.success("Consultation request fetched successfully", response);
    }

    @AdminOnly
    @PutMapping("/{consultationRequestId}")
    public ApiResponse<ConsultationRequestResponse> updateConsultationRequest(
            @PathVariable Long consultationRequestId,
            @Valid @RequestBody UpdateConsultationRequest request
    ) {
        ConsultationRequestResponse response =
                consultationRequestService.updateConsultationRequest(consultationRequestId, request);

        return ApiResponse.success("Consultation request updated successfully", response);
    }

    @AdminOnly
    @PatchMapping("/{consultationRequestId}/status")
    public ApiResponse<ConsultationRequestResponse> updateConsultationRequestStatus(
            @PathVariable Long consultationRequestId,
            @Valid @RequestBody UpdateConsultationRequestStatusRequest request
    ) {
        ConsultationRequestResponse response =
                consultationRequestService.updateConsultationRequestStatus(consultationRequestId, request);

        return ApiResponse.success("Consultation request status updated successfully", response);
    }
}