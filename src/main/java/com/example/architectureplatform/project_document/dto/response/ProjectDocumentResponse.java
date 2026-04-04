package com.example.architectureplatform.project_document.dto.response;

import com.example.architectureplatform.project_document.enums.ProjectDocumentType;

import java.time.LocalDateTime;

public record ProjectDocumentResponse(
        Long id,
        Long projectId,
        String projectCode,
        String projectName,
        String title,
        ProjectDocumentType documentType,
        String documentUrl,
        String fileName,
        String mimeType,
        Long fileSizeBytes,
        String description,
        boolean publicVisible,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}