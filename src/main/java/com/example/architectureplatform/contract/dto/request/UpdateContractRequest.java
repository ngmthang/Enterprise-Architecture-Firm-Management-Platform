package com.example.architectureplatform.contract.dto.request;

import com.example.architectureplatform.contract.enums.ContractStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record UpdateContractRequest(

        Long projectId,

        Long quotationId,

        @NotBlank(message = "Contract title is required")
        @Size(max = 255, message = "Contract title must not exceed 255 characters")
        String title,

        @NotNull(message = "Contract status is required")
        ContractStatus status,

        LocalDate contractDate,
        LocalDate startDate,
        LocalDate endDate,

        Boolean signedByClient,
        Boolean signedByCompany,
        LocalDateTime signedAt,

        @NotBlank(message = "Client name is required")
        @Size(max = 255, message = "Client name must not exceed 255 characters")
        String clientName,

        @Email(message = "Client email must be a valid email address")
        @Size(max = 255, message = "Client email must not exceed 255 characters")
        String clientEmail,

        @Size(max = 50, message = "Client phone must not exceed 50 characters")
        String clientPhone,

        @DecimalMin(value = "0.0", inclusive = true, message = "Contract value must be non-negative")
        BigDecimal contractValue,

        @NotBlank(message = "Currency is required")
        @Size(max = 10, message = "Currency must not exceed 10 characters")
        String currency,

        @Size(max = 1000, message = "Document URL must not exceed 1000 characters")
        String documentUrl,

        String scopeSummary,
        String termsAndConditions,
        String notes,
        Boolean active
) {
}