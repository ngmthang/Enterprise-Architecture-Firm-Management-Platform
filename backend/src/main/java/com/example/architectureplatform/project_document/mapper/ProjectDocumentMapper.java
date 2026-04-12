package com.example.architectureplatform.project_document.mapper;

import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.project_document.dto.request.CreateProjectDocumentRequest;
import com.example.architectureplatform.project_document.dto.request.UpdateProjectDocumentRequest;
import com.example.architectureplatform.project_document.dto.response.ProjectDocumentResponse;
import com.example.architectureplatform.project_document.entity.ProjectDocument;
import org.springframework.stereotype.Component;

@Component
public class ProjectDocumentMapper {

    public ProjectDocument toEntity(CreateProjectDocumentRequest request, Project project) {
        ProjectDocument document = new ProjectDocument();
        document.setProject(project);
        document.setTitle(request.title().trim());
        document.setDocumentType(request.documentType());
        document.setDocumentUrl(request.documentUrl().trim());
        document.setFileName(trimToNull(request.fileName()));
        document.setMimeType(trimToNull(request.mimeType()));
        document.setFileSizeBytes(request.fileSizeBytes());
        document.setDescription(trimToNull(request.description()));
        document.setPublicVisible(request.publicVisible() != null && request.publicVisible());
        document.setActive(request.active() == null || request.active());
        return document;
    }

    public void updateEntity(ProjectDocument document, UpdateProjectDocumentRequest request) {
        document.setTitle(request.title().trim());
        document.setDocumentType(request.documentType());
        document.setDocumentUrl(request.documentUrl().trim());
        document.setFileName(trimToNull(request.fileName()));
        document.setMimeType(trimToNull(request.mimeType()));
        document.setFileSizeBytes(request.fileSizeBytes());
        document.setDescription(trimToNull(request.description()));
        document.setPublicVisible(request.publicVisible() != null && request.publicVisible());
        document.setActive(request.active() == null || request.active());
    }

    public ProjectDocumentResponse toResponse(ProjectDocument document) {
        return new ProjectDocumentResponse(
                document.getId(),
                document.getProject().getId(),
                document.getProject().getCode(),
                document.getProject().getName(),
                document.getTitle(),
                document.getDocumentType(),
                document.getDocumentUrl(),
                document.getFileName(),
                document.getMimeType(),
                document.getFileSizeBytes(),
                document.getDescription(),
                document.isPublicVisible(),
                document.isActive(),
                document.getCreatedAt(),
                document.getUpdatedAt()
        );
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}