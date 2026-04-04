package com.example.architectureplatform.contract.repository;

import com.example.architectureplatform.contract.entity.Contract;
import com.example.architectureplatform.contract.enums.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    Optional<Contract> findByCode(String code);

    boolean existsByCode(String code);

    List<Contract> findAllByOrderByCreatedAtDesc();

    List<Contract> findByStatusOrderByCreatedAtDesc(ContractStatus status);

    List<Contract> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<Contract> findByQuotationIdOrderByCreatedAtDesc(Long quotationId);

    List<Contract> findByActiveTrueOrderByCreatedAtDesc();
}