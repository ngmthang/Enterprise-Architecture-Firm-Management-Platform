package com.example.architectureplatform.quotation.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.quotation.dto.request.CreateQuotationRequest;
import com.example.architectureplatform.quotation.dto.request.UpdateQuotationRequest;
import com.example.architectureplatform.quotation.dto.request.UpdateQuotationStatusRequest;
import com.example.architectureplatform.quotation.dto.response.QuotationResponse;
import com.example.architectureplatform.quotation.enums.QuotationStatus;
import com.example.architectureplatform.quotation.service.QuotationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @Operation(summary = "Get public quotation by token")
    @GetMapping("/public/{publicToken}")
    public ApiResponse<QuotationResponse> getPublicQuotationByToken(@PathVariable String publicToken) {
        return ApiResponse.success(
                "Quotation retrieved successfully",
                quotationService.getPublicQuotationByToken(publicToken)
        );
    }

    @Operation(summary = "Get all quotations")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public ApiResponse<List<QuotationResponse>> getAllQuotations(
            @RequestParam(required = false) QuotationStatus status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long consultationId
    ) {
        List<QuotationResponse> quotations;

        if (status != null) {
            quotations = quotationService.getQuotationsByStatus(status);
        } else if (projectId != null) {
            quotations = quotationService.getQuotationsByProjectId(projectId);
        } else if (consultationId != null) {
            quotations = quotationService.getQuotationsByConsultationId(consultationId);
        } else {
            quotations = quotationService.getAllQuotations();
        }

        return ApiResponse.success("Quotations retrieved successfully", quotations);
    }

    @Operation(summary = "Get quotation by id")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<QuotationResponse> getQuotationById(@PathVariable Long id) {
        return ApiResponse.success(
                "Quotation retrieved successfully",
                quotationService.getQuotationById(id)
        );
    }

    @Operation(summary = "Get quotation by code")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/code/{code}")
    public ApiResponse<QuotationResponse> getQuotationByCode(@PathVariable String code) {
        return ApiResponse.success(
                "Quotation retrieved successfully",
                quotationService.getQuotationByCode(code)
        );
    }

    @Operation(summary = "Create quotation")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ApiResponse<QuotationResponse> createQuotation(@Valid @RequestBody CreateQuotationRequest request) {
        return ApiResponse.success(
                "Quotation created successfully",
                quotationService.createQuotation(request)
        );
    }

    @Operation(summary = "Update quotation")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<QuotationResponse> updateQuotation(
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuotationRequest request
    ) {
        return ApiResponse.success(
                "Quotation updated successfully",
                quotationService.updateQuotation(id, request)
        );
    }

    @Operation(summary = "Update quotation status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PatchMapping("/{id}/status")
    public ApiResponse<QuotationResponse> updateQuotationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuotationStatusRequest request
    ) {
        return ApiResponse.success(
                "Quotation status updated successfully",
                quotationService.updateQuotationStatus(id, request)
        );
    }
}