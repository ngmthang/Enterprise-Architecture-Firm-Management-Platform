package com.example.architectureplatform.invoice.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.invoice.dto.request.CreateInvoiceRequest;
import com.example.architectureplatform.invoice.dto.request.UpdateInvoiceRequest;
import com.example.architectureplatform.invoice.dto.request.UpdateInvoiceStatusRequest;
import com.example.architectureplatform.invoice.dto.response.InvoiceResponse;
import com.example.architectureplatform.invoice.enums.InvoiceStatus;
import com.example.architectureplatform.invoice.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @Operation(summary = "Get all invoices")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public ApiResponse<List<InvoiceResponse>> getAllInvoices(
            @RequestParam(required = false) InvoiceStatus status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long contractId
    ) {
        List<InvoiceResponse> invoices;

        if (status != null) {
            invoices = invoiceService.getInvoicesByStatus(status);
        } else if (projectId != null) {
            invoices = invoiceService.getInvoicesByProjectId(projectId);
        } else if (contractId != null) {
            invoices = invoiceService.getInvoicesByContractId(contractId);
        } else {
            invoices = invoiceService.getAllInvoices();
        }

        return ApiResponse.success("Invoices retrieved successfully", invoices);
    }

    @Operation(summary = "Get invoice by id")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<InvoiceResponse> getInvoiceById(@PathVariable Long id) {
        return ApiResponse.success(
                "Invoice retrieved successfully",
                invoiceService.getInvoiceById(id)
        );
    }

    @Operation(summary = "Get invoice by code")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/code/{code}")
    public ApiResponse<InvoiceResponse> getInvoiceByCode(@PathVariable String code) {
        return ApiResponse.success(
                "Invoice retrieved successfully",
                invoiceService.getInvoiceByCode(code)
        );
    }

    @Operation(summary = "Create invoice")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ApiResponse<InvoiceResponse> createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        return ApiResponse.success(
                "Invoice created successfully",
                invoiceService.createInvoice(request)
        );
    }

    @Operation(summary = "Update invoice")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<InvoiceResponse> updateInvoice(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInvoiceRequest request
    ) {
        return ApiResponse.success(
                "Invoice updated successfully",
                invoiceService.updateInvoice(id, request)
        );
    }

    @Operation(summary = "Update invoice status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PatchMapping("/{id}/status")
    public ApiResponse<InvoiceResponse> updateInvoiceStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInvoiceStatusRequest request
    ) {
        return ApiResponse.success(
                "Invoice status updated successfully",
                invoiceService.updateInvoiceStatus(id, request)
        );
    }
}