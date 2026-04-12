package com.example.architectureplatform.project_document.service;

import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.project.exception.ProjectNotFoundException;
import com.example.architectureplatform.project.repository.ProjectRepository;
import com.example.architectureplatform.project_document.dto.request.CreateProjectDocumentRequest;
import com.example.architectureplatform.project_document.dto.request.UpdateProjectDocumentRequest;
import com.example.architectureplatform.project_document.dto.response.ProjectDocumentResponse;
import com.example.architectureplatform.project_document.entity.ProjectDocument;
import com.example.architectureplatform.project_document.enums.ProjectDocumentType;
import com.example.architectureplatform.project_document.exception.ProjectDocumentAlreadyExistsException;
import com.example.architectureplatform.project_document.exception.ProjectDocumentNotFoundException;
import com.example.architectureplatform.project_document.mapper.ProjectDocumentMapper;
import com.example.architectureplatform.project_document.repository.ProjectDocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectDocumentService {

    private final ProjectDocumentRepository projectDocumentRepository;
    private final ProjectRepository projectRepository;
    private final ProjectDocumentMapper projectDocumentMapper;

    public ProjectDocumentService(
            ProjectDocumentRepository projectDocumentRepository,
            ProjectRepository projectRepository,
            ProjectDocumentMapper projectDocumentMapper
    ) {
        this.projectDocumentRepository = projectDocumentRepository;
        this.projectRepository = projectRepository;
        this.projectDocumentMapper = projectDocumentMapper;
    }

    @Transactional(readOnly = true)
    public List<ProjectDocumentResponse> getAllDocuments() {
        return projectDocumentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(projectDocumentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectDocumentResponse> getDocumentsByProjectId(Long projectId) {
        ensureProjectExists(projectId);

        return projectDocumentRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(projectDocumentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectDocumentResponse> getPublicDocumentsByProjectId(Long projectId) {
        ensureProjectExists(projectId);

        return projectDocumentRepository.findByProjectIdAndPublicVisibleTrueAndActiveTrueOrderByCreatedAtDesc(projectId)
                .stream()
                .map(projectDocumentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectDocumentResponse> getDocumentsByProjectIdAndType(Long projectId, ProjectDocumentType documentType) {
        ensureProjectExists(projectId);

        return projectDocumentRepository.findByProjectIdAndDocumentTypeOrderByCreatedAtDesc(projectId, documentType)
                .stream()
                .map(projectDocumentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDocumentResponse getDocumentById(Long id) {
        return projectDocumentMapper.toResponse(findDocumentById(id));
    }

    public ProjectDocumentResponse createDocument(CreateProjectDocumentRequest request) {
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new ProjectNotFoundException(request.projectId()));

        String normalizedTitle = request.title().trim();

        if (projectDocumentRepository.existsByProjectIdAndTitleIgnoreCase(project.getId(), normalizedTitle)) {
            throw new ProjectDocumentAlreadyExistsException(project.getId(), normalizedTitle);
        }

        ProjectDocument document = projectDocumentMapper.toEntity(request, project);
        ProjectDocument savedDocument = projectDocumentRepository.save(document);
        return projectDocumentMapper.toResponse(savedDocument);
    }

    public ProjectDocumentResponse updateDocument(Long id, UpdateProjectDocumentRequest request) {
        ProjectDocument document = findDocumentById(id);
        projectDocumentMapper.updateEntity(document, request);

        ProjectDocument updatedDocument = projectDocumentRepository.save(document);
        return projectDocumentMapper.toResponse(updatedDocument);
    }

    private ProjectDocument findDocumentById(Long id) {
        return projectDocumentRepository.findById(id)
                .orElseThrow(() -> new ProjectDocumentNotFoundException(id));
    }

    private void ensureProjectExists(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException(projectId);
        }
    }
}