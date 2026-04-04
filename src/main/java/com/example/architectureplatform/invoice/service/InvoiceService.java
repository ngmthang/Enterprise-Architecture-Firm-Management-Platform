package com.example.architectureplatform.invoice.service;

import com.example.architectureplatform.contract.entity.Contract;
import com.example.architectureplatform.contract.exception.ContractNotFoundException;
import com.example.architectureplatform.contract.repository.ContractRepository;
import com.example.architectureplatform.invoice.dto.request.CreateInvoiceRequest;
import com.example.architectureplatform.invoice.dto.request.UpdateInvoiceRequest;
import com.example.architectureplatform.invoice.dto.request.UpdateInvoiceStatusRequest;
import com.example.architectureplatform.invoice.dto.response.InvoiceResponse;
import com.example.architectureplatform.invoice.entity.Invoice;
import com.example.architectureplatform.invoice.enums.InvoiceStatus;
import com.example.architectureplatform.invoice.exception.InvoiceAlreadyExistsException;
import com.example.architectureplatform.invoice.exception.InvoiceNotFoundException;
import com.example.architectureplatform.invoice.mapper.InvoiceMapper;
import com.example.architectureplatform.invoice.repository.InvoiceRepository;
import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.project.exception.ProjectNotFoundException;
import com.example.architectureplatform.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final InvoiceMapper invoiceMapper;

    public InvoiceService(
            InvoiceRepository invoiceRepository,
            ProjectRepository projectRepository,
            ContractRepository contractRepository,
            InvoiceMapper invoiceMapper
    ) {
        this.invoiceRepository = invoiceRepository;
        this.projectRepository = projectRepository;
        this.contractRepository = contractRepository;
        this.invoiceMapper = invoiceMapper;
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(invoiceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByStatus(InvoiceStatus status) {
        return invoiceRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(invoiceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByProjectId(Long projectId) {
        ensureProjectExists(projectId);

        return invoiceRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(invoiceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByContractId(Long contractId) {
        ensureContractExists(contractId);

        return invoiceRepository.findByContractIdOrderByCreatedAtDesc(contractId)
                .stream()
                .map(invoiceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        return invoiceMapper.toResponse(findInvoiceById(id));
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByCode(String code) {
        Invoice invoice = invoiceRepository.findByCode(code)
                .orElseThrow(() -> new InvoiceNotFoundException(code));

        return invoiceMapper.toResponse(invoice);
    }

    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {
        String normalizedCode = request.code().trim();

        if (invoiceRepository.existsByCode(normalizedCode)) {
            throw new InvoiceAlreadyExistsException(normalizedCode);
        }

        validateDates(request.invoiceDate(), request.dueDate(), request.paidDate());
        validateAmounts(
                request.subtotalAmount(),
                request.taxAmount(),
                request.discountAmount(),
                request.totalAmount(),
                request.amountPaid(),
                request.balanceDue()
        );

        Project project = resolveProject(request.projectId());
        Contract contract = resolveContract(request.contractId());

        Invoice invoice = invoiceMapper.toEntity(request, project, contract);
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toResponse(savedInvoice);
    }

    public InvoiceResponse updateInvoice(Long id, UpdateInvoiceRequest request) {
        validateDates(request.invoiceDate(), request.dueDate(), request.paidDate());
        validateAmounts(
                request.subtotalAmount(),
                request.taxAmount(),
                request.discountAmount(),
                request.totalAmount(),
                request.amountPaid(),
                request.balanceDue()
        );

        Invoice invoice = findInvoiceById(id);
        Project project = resolveProject(request.projectId());
        Contract contract = resolveContract(request.contractId());

        invoiceMapper.updateEntity(invoice, request, project, contract);

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toResponse(updatedInvoice);
    }

    public InvoiceResponse updateInvoiceStatus(Long id, UpdateInvoiceStatusRequest request) {
        Invoice invoice = findInvoiceById(id);
        invoice.setStatus(request.status());

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toResponse(updatedInvoice);
    }

    private Invoice findInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException(id));
    }

    private Project resolveProject(Long projectId) {
        if (projectId == null) {
            return null;
        }

        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
    }

    private Contract resolveContract(Long contractId) {
        if (contractId == null) {
            return null;
        }

        return contractRepository.findById(contractId)
                .orElseThrow(() -> new ContractNotFoundException(contractId));
    }

    private void ensureProjectExists(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException(projectId);
        }
    }

    private void ensureContractExists(Long contractId) {
        if (!contractRepository.existsById(contractId)) {
            throw new ContractNotFoundException(contractId);
        }
    }

    private void validateDates(LocalDate invoiceDate, LocalDate dueDate, LocalDate paidDate) {
        if (invoiceDate != null && dueDate != null && dueDate.isBefore(invoiceDate)) {
            throw new IllegalArgumentException("Due date must be on or after invoice date");
        }

        if (invoiceDate != null && paidDate != null && paidDate.isBefore(invoiceDate)) {
            throw new IllegalArgumentException("Paid date must be on or after invoice date");
        }
    }

    private void validateAmounts(
            java.math.BigDecimal subtotalAmount,
            java.math.BigDecimal taxAmount,
            java.math.BigDecimal discountAmount,
            java.math.BigDecimal totalAmount,
            java.math.BigDecimal amountPaid,
            java.math.BigDecimal balanceDue
    ) {
        java.math.BigDecimal subtotal = subtotalAmount == null ? java.math.BigDecimal.ZERO : subtotalAmount;
        java.math.BigDecimal tax = taxAmount == null ? java.math.BigDecimal.ZERO : taxAmount;
        java.math.BigDecimal discount = discountAmount == null ? java.math.BigDecimal.ZERO : discountAmount;
        java.math.BigDecimal total = totalAmount == null ? java.math.BigDecimal.ZERO : totalAmount;
        java.math.BigDecimal paid = amountPaid == null ? java.math.BigDecimal.ZERO : amountPaid;
        java.math.BigDecimal balance = balanceDue == null ? java.math.BigDecimal.ZERO : balanceDue;

        if (paid.compareTo(total) > 0) {
            throw new IllegalArgumentException("Amount paid cannot exceed total amount");
        }

        if (balance.compareTo(total) > 0) {
            throw new IllegalArgumentException("Balance due cannot exceed total amount");
        }

        if (subtotal.add(tax).subtract(discount).compareTo(total) != 0) {
            throw new IllegalArgumentException("Total amount must equal subtotal amount plus tax amount minus discount amount");
        }

        if (total.subtract(paid).compareTo(balance) != 0) {
            throw new IllegalArgumentException("Balance due must equal total amount minus amount paid");
        }
    }
}