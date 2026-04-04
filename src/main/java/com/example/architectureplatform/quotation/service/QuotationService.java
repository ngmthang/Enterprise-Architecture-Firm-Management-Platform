package com.example.architectureplatform.quotation.service;

import com.example.architectureplatform.consultation.entity.ConsultationRequest;
import com.example.architectureplatform.consultation.repository.ConsultationRequestRepository;
import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.project.exception.ProjectNotFoundException;
import com.example.architectureplatform.project.repository.ProjectRepository;
import com.example.architectureplatform.quotation.dto.request.CreateQuotationRequest;
import com.example.architectureplatform.quotation.dto.request.UpdateQuotationRequest;
import com.example.architectureplatform.quotation.dto.request.UpdateQuotationStatusRequest;
import com.example.architectureplatform.quotation.dto.response.QuotationResponse;
import com.example.architectureplatform.quotation.entity.Quotation;
import com.example.architectureplatform.quotation.enums.QuotationStatus;
import com.example.architectureplatform.quotation.exception.QuotationAlreadyExistsException;
import com.example.architectureplatform.quotation.exception.QuotationNotFoundException;
import com.example.architectureplatform.quotation.mapper.QuotationMapper;
import com.example.architectureplatform.quotation.repository.QuotationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final ProjectRepository projectRepository;
    private final ConsultationRequestRepository consultationRepository;
    private final QuotationMapper quotationMapper;

    public QuotationService(
            QuotationRepository quotationRepository,
            ProjectRepository projectRepository,
            ConsultationRequestRepository consultationRepository,
            QuotationMapper quotationMapper
    ) {
        this.quotationRepository = quotationRepository;
        this.projectRepository = projectRepository;
        this.consultationRepository = consultationRepository;
        this.quotationMapper = quotationMapper;
    }

    @Transactional(readOnly = true)
    public QuotationResponse getPublicQuotationByToken(String publicToken) {
        Quotation quotation = quotationRepository.findByPublicToken(publicToken)
                .filter(Quotation::isActive)
                .orElseThrow(() -> new QuotationNotFoundException(publicToken, true));

        return quotationMapper.toResponse(quotation);
    }

    @Transactional(readOnly = true)
    public List<QuotationResponse> getAllQuotations() {
        return quotationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(quotationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuotationResponse> getQuotationsByStatus(QuotationStatus status) {
        return quotationRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(quotationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuotationResponse> getQuotationsByProjectId(Long projectId) {
        ensureProjectExists(projectId);

        return quotationRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(quotationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuotationResponse> getQuotationsByConsultationId(Long consultationId) {
        ensureConsultationExists(consultationId);

        return quotationRepository.findByConsultationIdOrderByCreatedAtDesc(consultationId)
                .stream()
                .map(quotationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuotationResponse getQuotationById(Long id) {
        return quotationMapper.toResponse(findQuotationById(id));
    }

    @Transactional(readOnly = true)
    public QuotationResponse getQuotationByCode(String code) {
        Quotation quotation = quotationRepository.findByCode(code)
                .orElseThrow(() -> new QuotationNotFoundException(code));

        return quotationMapper.toResponse(quotation);
    }

    public QuotationResponse createQuotation(CreateQuotationRequest request) {
        String normalizedCode = request.code().trim();

        if (quotationRepository.existsByCode(normalizedCode)) {
            throw new QuotationAlreadyExistsException(normalizedCode);
        }

        validateDates(request.issueDate(), request.validUntil());

        Project project = resolveProject(request.projectId());
        ConsultationRequest consultation = resolveConsultation(request.consultationId());
        String publicToken = generatePublicToken();

        Quotation quotation = quotationMapper.toEntity(request, project, consultation, publicToken);
        Quotation savedQuotation = quotationRepository.save(quotation);
        return quotationMapper.toResponse(savedQuotation);
    }

    public QuotationResponse updateQuotation(Long id, UpdateQuotationRequest request) {
        validateDates(request.issueDate(), request.validUntil());

        Quotation quotation = findQuotationById(id);
        Project project = resolveProject(request.projectId());
        ConsultationRequest consultation = resolveConsultation(request.consultationId());

        quotationMapper.updateEntity(quotation, request, project, consultation);

        Quotation updatedQuotation = quotationRepository.save(quotation);
        return quotationMapper.toResponse(updatedQuotation);
    }

    public QuotationResponse updateQuotationStatus(Long id, UpdateQuotationStatusRequest request) {
        Quotation quotation = findQuotationById(id);
        quotation.setStatus(request.status());

        Quotation updatedQuotation = quotationRepository.save(quotation);
        return quotationMapper.toResponse(updatedQuotation);
    }

    private Quotation findQuotationById(Long id) {
        return quotationRepository.findById(id)
                .orElseThrow(() -> new QuotationNotFoundException(id));
    }

    private Project resolveProject(Long projectId) {
        if (projectId == null) {
            return null;
        }

        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
    }

    private ConsultationRequest resolveConsultation(Long consultationId) {
        if (consultationId == null) {
            return null;
        }

        return consultationRepository.findById(consultationId)
                .orElseThrow(() -> new IllegalArgumentException("Consultation request not found with id: " + consultationId));
    }

    private void ensureProjectExists(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException(projectId);
        }
    }

    private void ensureConsultationExists(Long consultationId) {
        if (!consultationRepository.existsById(consultationId)) {
            throw new IllegalArgumentException("Consultation request not found with id: " + consultationId);
        }
    }

    private void validateDates(LocalDate issueDate, LocalDate validUntil) {
        if (issueDate != null && validUntil != null && validUntil.isBefore(issueDate)) {
            throw new IllegalArgumentException("Valid until date must be on or after issue date");
        }
    }

    private String generatePublicToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "");
        } while (quotationRepository.existsByPublicToken(token));
        return token;
    }
}