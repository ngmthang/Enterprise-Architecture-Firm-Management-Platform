package com.example.architectureplatform.contract.dto.request;

import com.example.architectureplatform.contract.enums.ContractStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateContractStatusRequest(

        @NotNull(message = "Contract status is required")
        ContractStatus status
) {
}