package com.example.architectureplatform.invoice.mapper;

import com.example.architectureplatform.contract.entity.Contract;
import com.example.architectureplatform.invoice.dto.request.CreateInvoiceRequest;
import com.example.architectureplatform.invoice.dto.request.UpdateInvoiceRequest;
import com.example.architectureplatform.invoice.dto.response.InvoiceResponse;
import com.example.architectureplatform.invoice.entity.Invoice;
import com.example.architectureplatform.invoice.enums.InvoiceStatus;
import com.example.architectureplatform.project.entity.Project;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class InvoiceMapper {

    public Invoice toEntity(
            CreateInvoiceRequest request,
            Project project,
            Contract contract
    ) {
        Invoice invoice = new Invoice();
        invoice.setCode(request.code().trim());
        invoice.setProject(project);
        invoice.setContract(contract);
        invoice.setTitle(request.title().trim());
        invoice.setStatus(request.status() != null ? request.status() : InvoiceStatus.DRAFT);
        invoice.setInvoiceDate(request.invoiceDate());
        invoice.setDueDate(request.dueDate());
        invoice.setPaidDate(request.paidDate());
        invoice.setCurrency(request.currency().trim().toUpperCase());
        invoice.setSubtotalAmount(defaultAmount(request.subtotalAmount()));
        invoice.setTaxAmount(defaultAmount(request.taxAmount()));
        invoice.setDiscountAmount(defaultAmount(request.discountAmount()));
        invoice.setTotalAmount(defaultAmount(request.totalAmount()));
        invoice.setAmountPaid(defaultAmount(request.amountPaid()));
        invoice.setBalanceDue(defaultAmount(request.balanceDue()));
        invoice.setClientName(request.clientName().trim());
        invoice.setClientEmail(trimToNull(request.clientEmail()));
        invoice.setClientPhone(trimToNull(request.clientPhone()));
        invoice.setDocumentUrl(trimToNull(request.documentUrl()));
        invoice.setDescription(trimToNull(request.description()));
        invoice.setNotes(trimToNull(request.notes()));
        invoice.setActive(request.active() == null || request.active());
        return invoice;
    }

    public void updateEntity(
            Invoice invoice,
            UpdateInvoiceRequest request,
            Project project,
            Contract contract
    ) {
        invoice.setProject(project);
        invoice.setContract(contract);
        invoice.setTitle(request.title().trim());
        invoice.setStatus(request.status());
        invoice.setInvoiceDate(request.invoiceDate());
        invoice.setDueDate(request.dueDate());
        invoice.setPaidDate(request.paidDate());
        invoice.setCurrency(request.currency().trim().toUpperCase());
        invoice.setSubtotalAmount(defaultAmount(request.subtotalAmount()));
        invoice.setTaxAmount(defaultAmount(request.taxAmount()));
        invoice.setDiscountAmount(defaultAmount(request.discountAmount()));
        invoice.setTotalAmount(defaultAmount(request.totalAmount()));
        invoice.setAmountPaid(defaultAmount(request.amountPaid()));
        invoice.setBalanceDue(defaultAmount(request.balanceDue()));
        invoice.setClientName(request.clientName().trim());
        invoice.setClientEmail(trimToNull(request.clientEmail()));
        invoice.setClientPhone(trimToNull(request.clientPhone()));
        invoice.setDocumentUrl(trimToNull(request.documentUrl()));
        invoice.setDescription(trimToNull(request.description()));
        invoice.setNotes(trimToNull(request.notes()));
        invoice.setActive(request.active() == null || request.active());
    }

    public InvoiceResponse toResponse(Invoice invoice) {
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getCode(),
                invoice.getProject() != null ? invoice.getProject().getId() : null,
                invoice.getProject() != null ? invoice.getProject().getCode() : null,
                invoice.getContract() != null ? invoice.getContract().getId() : null,
                invoice.getContract() != null ? invoice.getContract().getCode() : null,
                invoice.getTitle(),
                invoice.getStatus(),
                invoice.getInvoiceDate(),
                invoice.getDueDate(),
                invoice.getPaidDate(),
                invoice.getCurrency(),
                invoice.getSubtotalAmount(),
                invoice.getTaxAmount(),
                invoice.getDiscountAmount(),
                invoice.getTotalAmount(),
                invoice.getAmountPaid(),
                invoice.getBalanceDue(),
                invoice.getClientName(),
                invoice.getClientEmail(),
                invoice.getClientPhone(),
                invoice.getDocumentUrl(),
                invoice.getDescription(),
                invoice.getNotes(),
                invoice.isActive(),
                invoice.getCreatedAt(),
                invoice.getUpdatedAt()
        );
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private BigDecimal defaultAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}