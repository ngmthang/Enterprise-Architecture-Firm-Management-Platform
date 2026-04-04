package com.example.architectureplatform.quotation.mapper;

import com.example.architectureplatform.consultation.entity.ConsultationRequest;
import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.quotation.dto.request.CreateQuotationRequest;
import com.example.architectureplatform.quotation.dto.request.UpdateQuotationRequest;
import com.example.architectureplatform.quotation.dto.response.QuotationResponse;
import com.example.architectureplatform.quotation.entity.Quotation;
import com.example.architectureplatform.quotation.enums.QuotationStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class QuotationMapper {

    public Quotation toEntity(
            CreateQuotationRequest request,
            Project project,
            ConsultationRequest consultation,
            String publicToken
    ) {
        Quotation quotation = new Quotation();
        quotation.setCode(request.code().trim());
        quotation.setProject(project);
        quotation.setConsultation(consultation);
        quotation.setTitle(request.title().trim());
        quotation.setStatus(request.status() != null ? request.status() : QuotationStatus.DRAFT);
        quotation.setCurrency(request.currency().trim().toUpperCase());
        quotation.setSubtotalAmount(defaultAmount(request.subtotalAmount()));
        quotation.setTaxAmount(defaultAmount(request.taxAmount()));
        quotation.setDiscountAmount(defaultAmount(request.discountAmount()));
        quotation.setTotalAmount(defaultAmount(request.totalAmount()));
        quotation.setIssueDate(request.issueDate());
        quotation.setValidUntil(request.validUntil());
        quotation.setClientName(request.clientName().trim());
        quotation.setClientEmail(trimToNull(request.clientEmail()));
        quotation.setClientPhone(trimToNull(request.clientPhone()));
        quotation.setScopeSummary(trimToNull(request.scopeSummary()));
        quotation.setTermsAndConditions(trimToNull(request.termsAndConditions()));
        quotation.setNotes(trimToNull(request.notes()));
        quotation.setPublicToken(publicToken);
        quotation.setActive(request.active() == null || request.active());
        return quotation;
    }

    public void updateEntity(
            Quotation quotation,
            UpdateQuotationRequest request,
            Project project,
            ConsultationRequest consultation
    ) {
        quotation.setProject(project);
        quotation.setConsultation(consultation);
        quotation.setTitle(request.title().trim());
        quotation.setStatus(request.status());
        quotation.setCurrency(request.currency().trim().toUpperCase());
        quotation.setSubtotalAmount(defaultAmount(request.subtotalAmount()));
        quotation.setTaxAmount(defaultAmount(request.taxAmount()));
        quotation.setDiscountAmount(defaultAmount(request.discountAmount()));
        quotation.setTotalAmount(defaultAmount(request.totalAmount()));
        quotation.setIssueDate(request.issueDate());
        quotation.setValidUntil(request.validUntil());
        quotation.setClientName(request.clientName().trim());
        quotation.setClientEmail(trimToNull(request.clientEmail()));
        quotation.setClientPhone(trimToNull(request.clientPhone()));
        quotation.setScopeSummary(trimToNull(request.scopeSummary()));
        quotation.setTermsAndConditions(trimToNull(request.termsAndConditions()));
        quotation.setNotes(trimToNull(request.notes()));
        quotation.setActive(request.active() == null || request.active());
    }

    public QuotationResponse toResponse(Quotation quotation) {
        return new QuotationResponse(
                quotation.getId(),
                quotation.getCode(),
                quotation.getProject() != null ? quotation.getProject().getId() : null,
                quotation.getProject() != null ? quotation.getProject().getCode() : null,
                quotation.getConsultation() != null ? quotation.getConsultation().getId() : null,
                quotation.getTitle(),
                quotation.getStatus(),
                quotation.getCurrency(),
                quotation.getSubtotalAmount(),
                quotation.getTaxAmount(),
                quotation.getDiscountAmount(),
                quotation.getTotalAmount(),
                quotation.getIssueDate(),
                quotation.getValidUntil(),
                quotation.getClientName(),
                quotation.getClientEmail(),
                quotation.getClientPhone(),
                quotation.getScopeSummary(),
                quotation.getTermsAndConditions(),
                quotation.getNotes(),
                quotation.getPublicToken(),
                quotation.isActive(),
                quotation.getCreatedAt(),
                quotation.getUpdatedAt()
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