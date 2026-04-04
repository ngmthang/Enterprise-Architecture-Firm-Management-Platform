package com.example.architectureplatform.portfolio.repository;

import com.example.architectureplatform.portfolio.entity.PortfolioProject;
import com.example.architectureplatform.portfolio.enums.PortfolioProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioProjectRepository extends JpaRepository<PortfolioProject, Long> {

    Optional<PortfolioProject> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<PortfolioProject> findByStatusOrderByDisplayOrderAscCreatedAtDesc(PortfolioProjectStatus status);

    List<PortfolioProject> findByFeaturedTrueAndStatusOrderByDisplayOrderAscCreatedAtDesc(
            PortfolioProjectStatus status
    );

    List<PortfolioProject> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}