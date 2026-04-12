package com.example.architectureplatform.project_document.repository;

import com.example.architectureplatform.project_document.entity.ProjectDocument;
import com.example.architectureplatform.project_document.enums.ProjectDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectDocumentRepository extends JpaRepository<ProjectDocument, Long> {

    boolean existsByProjectIdAndTitleIgnoreCase(Long projectId, String title);

    List<ProjectDocument> findAllByOrderByCreatedAtDesc();

    List<ProjectDocument> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<ProjectDocument> findByProjectIdAndActiveTrueOrderByCreatedAtDesc(Long projectId);

    List<ProjectDocument> findByProjectIdAndPublicVisibleTrueAndActiveTrueOrderByCreatedAtDesc(Long projectId);

    List<ProjectDocument> findByProjectIdAndDocumentTypeOrderByCreatedAtDesc(Long projectId, ProjectDocumentType documentType);

    Optional<ProjectDocument> findByIdAndActiveTrue(Long id);
}