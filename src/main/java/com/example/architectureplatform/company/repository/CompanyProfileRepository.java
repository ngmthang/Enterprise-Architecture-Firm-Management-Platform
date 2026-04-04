package com.example.architectureplatform.company.repository;

import com.example.architectureplatform.company.entity.CompanyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {
}