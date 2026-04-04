package com.example.architectureplatform.invoice.repository;

import com.example.architectureplatform.invoice.entity.Invoice;
import com.example.architectureplatform.invoice.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByCode(String code);

    boolean existsByCode(String code);

    List<Invoice> findAllByOrderByCreatedAtDesc();

    List<Invoice> findByStatusOrderByCreatedAtDesc(InvoiceStatus status);

    List<Invoice> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<Invoice> findByContractIdOrderByCreatedAtDesc(Long contractId);

    List<Invoice> findByActiveTrueOrderByCreatedAtDesc();
}