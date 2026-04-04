package com.example.architectureplatform.contract.mapper;

import com.example.architectureplatform.contract.dto.request.CreateContractRequest;
import com.example.architectureplatform.contract.dto.request.UpdateContractRequest;
import com.example.architectureplatform.contract.dto.response.ContractResponse;
import com.example.architectureplatform.contract.entity.Contract;
import com.example.architectureplatform.contract.enums.ContractStatus;
import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.quotation.entity.Quotation;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ContractMapper {

    public Contract toEntity(
            CreateContractRequest request,
            Project project,
            Quotation quotation
    ) {
        Contract contract = new Contract();
        contract.setCode(request.code().trim());
        contract.setProject(project);
        contract.setQuotation(quotation);
        contract.setTitle(request.title().trim());
        contract.setStatus(request.status() != null ? request.status() : ContractStatus.DRAFT);
        contract.setContractDate(request.contractDate());
        contract.setStartDate(request.startDate());
        contract.setEndDate(request.endDate());
        contract.setSignedByClient(request.signedByClient() != null && request.signedByClient());
        contract.setSignedByCompany(request.signedByCompany() != null && request.signedByCompany());
        contract.setSignedAt(request.signedAt());
        contract.setClientName(request.clientName().trim());
        contract.setClientEmail(trimToNull(request.clientEmail()));
        contract.setClientPhone(trimToNull(request.clientPhone()));
        contract.setContractValue(defaultAmount(request.contractValue()));
        contract.setCurrency(request.currency().trim().toUpperCase());
        contract.setDocumentUrl(trimToNull(request.documentUrl()));
        contract.setScopeSummary(trimToNull(request.scopeSummary()));
        contract.setTermsAndConditions(trimToNull(request.termsAndConditions()));
        contract.setNotes(trimToNull(request.notes()));
        contract.setActive(request.active() == null || request.active());
        return contract;
    }

    public void updateEntity(
            Contract contract,
            UpdateContractRequest request,
            Project project,
            Quotation quotation
    ) {
        contract.setProject(project);
        contract.setQuotation(quotation);
        contract.setTitle(request.title().trim());
        contract.setStatus(request.status());
        contract.setContractDate(request.contractDate());
        contract.setStartDate(request.startDate());
        contract.setEndDate(request.endDate());
        contract.setSignedByClient(request.signedByClient() != null && request.signedByClient());
        contract.setSignedByCompany(request.signedByCompany() != null && request.signedByCompany());
        contract.setSignedAt(request.signedAt());
        contract.setClientName(request.clientName().trim());
        contract.setClientEmail(trimToNull(request.clientEmail()));
        contract.setClientPhone(trimToNull(request.clientPhone()));
        contract.setContractValue(defaultAmount(request.contractValue()));
        contract.setCurrency(request.currency().trim().toUpperCase());
        contract.setDocumentUrl(trimToNull(request.documentUrl()));
        contract.setScopeSummary(trimToNull(request.scopeSummary()));
        contract.setTermsAndConditions(trimToNull(request.termsAndConditions()));
        contract.setNotes(trimToNull(request.notes()));
        contract.setActive(request.active() == null || request.active());
    }

    public ContractResponse toResponse(Contract contract) {
        return new ContractResponse(
                contract.getId(),
                contract.getCode(),
                contract.getProject() != null ? contract.getProject().getId() : null,
                contract.getProject() != null ? contract.getProject().getCode() : null,
                contract.getQuotation() != null ? contract.getQuotation().getId() : null,
                contract.getQuotation() != null ? contract.getQuotation().getCode() : null,
                contract.getTitle(),
                contract.getStatus(),
                contract.getContractDate(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.isSignedByClient(),
                contract.isSignedByCompany(),
                contract.getSignedAt(),
                contract.getClientName(),
                contract.getClientEmail(),
                contract.getClientPhone(),
                contract.getContractValue(),
                contract.getCurrency(),
                contract.getDocumentUrl(),
                contract.getScopeSummary(),
                contract.getTermsAndConditions(),
                contract.getNotes(),
                contract.isActive(),
                contract.getCreatedAt(),
                contract.getUpdatedAt()
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