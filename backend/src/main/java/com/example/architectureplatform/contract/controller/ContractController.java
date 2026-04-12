package com.example.architectureplatform.contract.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.contract.dto.request.CreateContractRequest;
import com.example.architectureplatform.contract.dto.request.UpdateContractRequest;
import com.example.architectureplatform.contract.dto.request.UpdateContractStatusRequest;
import com.example.architectureplatform.contract.dto.response.ContractResponse;
import com.example.architectureplatform.contract.enums.ContractStatus;
import com.example.architectureplatform.contract.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @Operation(summary = "Get all contracts")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public ApiResponse<List<ContractResponse>> getAllContracts(
            @RequestParam(required = false) ContractStatus status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long quotationId
    ) {
        List<ContractResponse> contracts;

        if (status != null) {
            contracts = contractService.getContractsByStatus(status);
        } else if (projectId != null) {
            contracts = contractService.getContractsByProjectId(projectId);
        } else if (quotationId != null) {
            contracts = contractService.getContractsByQuotationId(quotationId);
        } else {
            contracts = contractService.getAllContracts();
        }

        return ApiResponse.success("Contracts retrieved successfully", contracts);
    }

    @Operation(summary = "Get contract by id")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<ContractResponse> getContractById(@PathVariable Long id) {
        return ApiResponse.success(
                "Contract retrieved successfully",
                contractService.getContractById(id)
        );
    }

    @Operation(summary = "Get contract by code")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/code/{code}")
    public ApiResponse<ContractResponse> getContractByCode(@PathVariable String code) {
        return ApiResponse.success(
                "Contract retrieved successfully",
                contractService.getContractByCode(code)
        );
    }

    @Operation(summary = "Create contract")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ApiResponse<ContractResponse> createContract(@Valid @RequestBody CreateContractRequest request) {
        return ApiResponse.success(
                "Contract created successfully",
                contractService.createContract(request)
        );
    }

    @Operation(summary = "Update contract")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<ContractResponse> updateContract(
            @PathVariable Long id,
            @Valid @RequestBody UpdateContractRequest request
    ) {
        return ApiResponse.success(
                "Contract updated successfully",
                contractService.updateContract(id, request)
        );
    }

    @Operation(summary = "Update contract status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PatchMapping("/{id}/status")
    public ApiResponse<ContractResponse> updateContractStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateContractStatusRequest request
    ) {
        return ApiResponse.success(
                "Contract status updated successfully",
                contractService.updateContractStatus(id, request)
        );
    }
}