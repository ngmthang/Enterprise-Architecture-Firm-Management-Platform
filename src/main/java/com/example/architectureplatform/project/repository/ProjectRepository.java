package com.example.architectureplatform.project.repository;

import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.project.enums.ProjectStatus;
import com.example.architectureplatform.project.enums.ProjectType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByCode(String code);

    boolean existsByCode(String code);

    List<Project> findByActiveTrueOrderByCreatedAtDesc();

    List<Project> findByActiveTrueAndProjectTypeOrderByCreatedAtDesc(ProjectType projectType);

    List<Project> findByStatusOrderByCreatedAtDesc(ProjectStatus status);

    List<Project> findByProjectTypeOrderByCreatedAtDesc(ProjectType projectType);

    List<Project> findAllByOrderByCreatedAtDesc();
}