package com.example.architectureplatform.invoice.dto.request;

import com.example.architectureplatform.invoice.enums.InvoiceStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateInvoiceStatusRequest(

        @NotNull(message = "Invoice status is required")
        InvoiceStatus status
) {
}