package com.example.architectureplatform.quotation.dto.request;

import com.example.architectureplatform.quotation.enums.QuotationStatus;
import jakarta.validation.constraints.NotNull;

public record PublicQuotationResponseRequest(
        @NotNull(message = "Quotation status is required")
        QuotationStatus status
) {
}