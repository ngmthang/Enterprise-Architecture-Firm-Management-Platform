package com.example.architectureplatform.project.service;

import com.example.architectureplatform.project.dto.request.CreateProjectRequest;
import com.example.architectureplatform.project.dto.request.UpdateProjectRequest;
import com.example.architectureplatform.project.dto.request.UpdateProjectStatusRequest;
import com.example.architectureplatform.project.dto.response.ProjectResponse;
import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.project.enums.ProjectStatus;
import com.example.architectureplatform.project.enums.ProjectType;
import com.example.architectureplatform.project.exception.ProjectAlreadyExistsException;
import com.example.architectureplatform.project.exception.ProjectNotFoundException;
import com.example.architectureplatform.project.mapper.ProjectMapper;
import com.example.architectureplatform.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    public ProjectService(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllPublicProjects() {
        return projectRepository.findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getPublicProjectsByType(ProjectType projectType) {
        return projectRepository.findByActiveTrueAndProjectTypeOrderByCreatedAtDesc(projectType)
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getPublicProjectByCode(String code) {
        Project project = projectRepository.findByCode(code)
                .filter(Project::isActive)
                .orElseThrow(() -> new ProjectNotFoundException(code));

        return projectMapper.toResponse(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllAdminProjects() {
        return projectRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAdminProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAdminProjectsByType(ProjectType projectType) {
        return projectRepository.findByProjectTypeOrderByCreatedAtDesc(projectType)
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        return projectMapper.toResponse(findProjectById(id));
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectByCode(String code) {
        Project project = projectRepository.findByCode(code)
                .orElseThrow(() -> new ProjectNotFoundException(code));

        return projectMapper.toResponse(project);
    }

    public ProjectResponse createProject(CreateProjectRequest request) {
        String normalizedCode = request.code().trim();

        if (projectRepository.existsByCode(normalizedCode)) {
            throw new ProjectAlreadyExistsException(normalizedCode);
        }

        validateProjectDates(request.startDate(), request.targetEndDate(), request.actualEndDate());

        Project project = projectMapper.toEntity(request);
        Project savedProject = projectRepository.save(project);
        return projectMapper.toResponse(savedProject);
    }

    public ProjectResponse updateProject(Long id, UpdateProjectRequest request) {
        validateProjectDates(request.startDate(), request.targetEndDate(), request.actualEndDate());

        Project project = findProjectById(id);
        projectMapper.updateEntity(project, request);

        Project updatedProject = projectRepository.save(project);
        return projectMapper.toResponse(updatedProject);
    }

    public ProjectResponse updateProjectStatus(Long id, UpdateProjectStatusRequest request) {
        Project project = findProjectById(id);
        project.setStatus(request.status());

        Project updatedProject = projectRepository.save(project);
        return projectMapper.toResponse(updatedProject);
    }

    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));
    }

    private void validateProjectDates(
            java.time.LocalDate startDate,
            java.time.LocalDate targetEndDate,
            java.time.LocalDate actualEndDate
    ) {
        if (startDate != null && targetEndDate != null && targetEndDate.isBefore(startDate)) {
            throw new IllegalArgumentException("Target end date must be on or after start date");
        }

        if (startDate != null && actualEndDate != null && actualEndDate.isBefore(startDate)) {
            throw new IllegalArgumentException("Actual end date must be on or after start date");
        }
    }
}