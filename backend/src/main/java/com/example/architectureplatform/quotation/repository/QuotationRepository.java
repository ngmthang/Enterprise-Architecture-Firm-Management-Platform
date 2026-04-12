package com.example.architectureplatform.quotation.repository;

import com.example.architectureplatform.quotation.entity.Quotation;
import com.example.architectureplatform.quotation.enums.QuotationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    Optional<Quotation> findByCode(String code);

    Optional<Quotation> findByPublicToken(String publicToken);

    boolean existsByCode(String code);

    boolean existsByPublicToken(String publicToken);

    List<Quotation> findAllByOrderByCreatedAtDesc();

    List<Quotation> findByActiveTrueOrderByCreatedAtDesc();

    List<Quotation> findByStatusOrderByCreatedAtDesc(QuotationStatus status);

    List<Quotation> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<Quotation> findByConsultationIdOrderByCreatedAtDesc(Long consultationId);
}