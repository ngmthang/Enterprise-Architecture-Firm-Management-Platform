package com.example.architectureplatform.service_catalog.repository;

import com.example.architectureplatform.service_catalog.entity.ServiceOffering;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {

    Optional<ServiceOffering> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<ServiceOffering> findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc();

    List<ServiceOffering> findByFeaturedTrueAndActiveTrueOrderByDisplayOrderAscCreatedAtDesc();

    List<ServiceOffering> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}