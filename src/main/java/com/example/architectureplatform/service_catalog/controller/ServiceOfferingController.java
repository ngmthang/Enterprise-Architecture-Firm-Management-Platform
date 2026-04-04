package com.example.architectureplatform.service_catalog.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.security.annotation.AdminOnly;
import com.example.architectureplatform.service_catalog.dto.request.CreateServiceOfferingRequest;
import com.example.architectureplatform.service_catalog.dto.request.UpdateServiceOfferingRequest;
import com.example.architectureplatform.service_catalog.dto.response.ServiceOfferingResponse;
import com.example.architectureplatform.service_catalog.service.ServiceOfferingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/service-offerings")
public class ServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    public ServiceOfferingController(ServiceOfferingService serviceOfferingService) {
        this.serviceOfferingService = serviceOfferingService;
    }

    @GetMapping
    public ApiResponse<List<ServiceOfferingResponse>> getActiveServiceOfferings() {
        List<ServiceOfferingResponse> responses = serviceOfferingService.getActiveServiceOfferings();
        return ApiResponse.success("Active service offerings fetched successfully", responses);
    }

    @GetMapping("/{slug}")
    public ApiResponse<ServiceOfferingResponse> getActiveServiceOfferingBySlug(
            @PathVariable String slug
    ) {
        ServiceOfferingResponse response = serviceOfferingService.getActiveServiceOfferingBySlug(slug);
        return ApiResponse.success("Active service offering fetched successfully", response);
    }

    @AdminOnly
    @PostMapping
    public ApiResponse<ServiceOfferingResponse> createServiceOffering(
            @Valid @RequestBody CreateServiceOfferingRequest request
    ) {
        ServiceOfferingResponse response = serviceOfferingService.createServiceOffering(request);
        return ApiResponse.success("Service offering created successfully", response);
    }

    @AdminOnly
    @PutMapping("/{id}")
    public ApiResponse<ServiceOfferingResponse> updateServiceOffering(
            @PathVariable Long id,
            @Valid @RequestBody UpdateServiceOfferingRequest request
    ) {
        ServiceOfferingResponse response = serviceOfferingService.updateServiceOffering(id, request);
        return ApiResponse.success("Service offering updated successfully", response);
    }
}