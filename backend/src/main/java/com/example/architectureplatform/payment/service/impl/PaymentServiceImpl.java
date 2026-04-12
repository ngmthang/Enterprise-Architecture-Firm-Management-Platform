package com.example.architectureplatform.payment.service.impl;

import com.example.architectureplatform.invoice.entity.Invoice;
import com.example.architectureplatform.invoice.repository.InvoiceRepository;
import com.example.architectureplatform.payment.dto.request.CreatePaymentRequest;
import com.example.architectureplatform.payment.dto.request.UpdatePaymentStatusRequest;
import com.example.architectureplatform.payment.dto.response.PaymentResponse;
import com.example.architectureplatform.payment.entity.Payment;
import com.example.architectureplatform.payment.exception.DuplicatePaymentReferenceException;
import com.example.architectureplatform.payment.exception.InvoiceNotFoundForPaymentException;
import com.example.architectureplatform.payment.exception.PaymentNotFoundException;
import com.example.architectureplatform.payment.mapper.PaymentMapper;
import com.example.architectureplatform.payment.repository.PaymentRepository;
import com.example.architectureplatform.payment.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentMapper paymentMapper;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            InvoiceRepository invoiceRepository,
            PaymentMapper paymentMapper
    ) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentMapper = paymentMapper;
    }

    @Override
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        if (request.paymentReference() != null
                && !request.paymentReference().isBlank()
                && paymentRepository.existsByPaymentReference(request.paymentReference())) {
            throw new DuplicatePaymentReferenceException(request.paymentReference());
        }

        Invoice invoice = invoiceRepository.findById(request.invoiceId())
                .orElseThrow(() -> new InvoiceNotFoundForPaymentException(request.invoiceId()));

        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setPaymentReference(
                request.paymentReference() == null || request.paymentReference().isBlank()
                        ? null
                        : request.paymentReference().trim()
        );
        payment.setPaymentMethod(request.paymentMethod());
        payment.setPaymentStatus(request.paymentStatus());
        payment.setAmount(request.amount());
        payment.setCurrency(request.currency().trim().toUpperCase());
        payment.setPaidAt(request.paidAt());
        payment.setNotes(request.notes());

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toResponse(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));

        return paymentMapper.toResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByInvoiceId(Long invoiceId) {
        if (!invoiceRepository.existsById(invoiceId)) {
            throw new InvoiceNotFoundForPaymentException(invoiceId);
        }

        return paymentRepository.findByInvoiceIdOrderByCreatedAtDesc(invoiceId)
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    @Override
    public PaymentResponse updatePaymentStatus(Long paymentId, UpdatePaymentStatusRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));

        payment.setPaymentStatus(request.paymentStatus());
        payment.setPaidAt(request.paidAt());

        Payment updatedPayment = paymentRepository.save(payment);
        return paymentMapper.toResponse(updatedPayment);
    }
}