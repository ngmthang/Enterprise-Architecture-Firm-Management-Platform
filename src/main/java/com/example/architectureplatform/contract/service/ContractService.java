package com.example.architectureplatform.contract.service;

import com.example.architectureplatform.contract.dto.request.CreateContractRequest;
import com.example.architectureplatform.contract.dto.request.UpdateContractRequest;
import com.example.architectureplatform.contract.dto.request.UpdateContractStatusRequest;
import com.example.architectureplatform.contract.dto.response.ContractResponse;
import com.example.architectureplatform.contract.entity.Contract;
import com.example.architectureplatform.contract.enums.ContractStatus;
import com.example.architectureplatform.contract.exception.ContractAlreadyExistsException;
import com.example.architectureplatform.contract.exception.ContractNotFoundException;
import com.example.architectureplatform.contract.mapper.ContractMapper;
import com.example.architectureplatform.contract.repository.ContractRepository;
import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.project.exception.ProjectNotFoundException;
import com.example.architectureplatform.project.repository.ProjectRepository;
import com.example.architectureplatform.quotation.entity.Quotation;
import com.example.architectureplatform.quotation.exception.QuotationNotFoundException;
import com.example.architectureplatform.quotation.repository.QuotationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ContractService {

    private final ContractRepository contractRepository;
    private final ProjectRepository projectRepository;
    private final QuotationRepository quotationRepository;
    private final ContractMapper contractMapper;

    public ContractService(
            ContractRepository contractRepository,
            ProjectRepository projectRepository,
            QuotationRepository quotationRepository,
            ContractMapper contractMapper
    ) {
        this.contractRepository = contractRepository;
        this.projectRepository = projectRepository;
        this.quotationRepository = quotationRepository;
        this.contractMapper = contractMapper;
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getAllContracts() {
        return contractRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(contractMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getContractsByStatus(ContractStatus status) {
        return contractRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(contractMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getContractsByProjectId(Long projectId) {
        ensureProjectExists(projectId);

        return contractRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(contractMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getContractsByQuotationId(Long quotationId) {
        ensureQuotationExists(quotationId);

        return contractRepository.findByQuotationIdOrderByCreatedAtDesc(quotationId)
                .stream()
                .map(contractMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ContractResponse getContractById(Long id) {
        return contractMapper.toResponse(findContractById(id));
    }

    @Transactional(readOnly = true)
    public ContractResponse getContractByCode(String code) {
        Contract contract = contractRepository.findByCode(code)
                .orElseThrow(() -> new ContractNotFoundException(code));

        return contractMapper.toResponse(contract);
    }

    public ContractResponse createContract(CreateContractRequest request) {
        String normalizedCode = request.code().trim();

        if (contractRepository.existsByCode(normalizedCode)) {
            throw new ContractAlreadyExistsException(normalizedCode);
        }

        validateDates(request.startDate(), request.endDate());

        Project project = resolveProject(request.projectId());
        Quotation quotation = resolveQuotation(request.quotationId());

        Contract contract = contractMapper.toEntity(request, project, quotation);
        Contract savedContract = contractRepository.save(contract);
        return contractMapper.toResponse(savedContract);
    }

    public ContractResponse updateContract(Long id, UpdateContractRequest request) {
        validateDates(request.startDate(), request.endDate());

        Contract contract = findContractById(id);
        Project project = resolveProject(request.projectId());
        Quotation quotation = resolveQuotation(request.quotationId());

        contractMapper.updateEntity(contract, request, project, quotation);

        Contract updatedContract = contractRepository.save(contract);
        return contractMapper.toResponse(updatedContract);
    }

    public ContractResponse updateContractStatus(Long id, UpdateContractStatusRequest request) {
        Contract contract = findContractById(id);
        contract.setStatus(request.status());

        Contract updatedContract = contractRepository.save(contract);
        return contractMapper.toResponse(updatedContract);
    }

    private Contract findContractById(Long id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new ContractNotFoundException(id));
    }

    private Project resolveProject(Long projectId) {
        if (projectId == null) {
            return null;
        }

        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
    }

    private Quotation resolveQuotation(Long quotationId) {
        if (quotationId == null) {
            return null;
        }

        return quotationRepository.findById(quotationId)
                .orElseThrow(() -> new QuotationNotFoundException(quotationId));
    }

    private void ensureProjectExists(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException(projectId);
        }
    }

    private void ensureQuotationExists(Long quotationId) {
        if (!quotationRepository.existsById(quotationId)) {
            throw new QuotationNotFoundException(quotationId);
        }
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }
    }
}