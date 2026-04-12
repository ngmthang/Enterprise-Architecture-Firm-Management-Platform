package com.example.architectureplatform.project_document.dto.request;

import com.example.architectureplatform.project_document.enums.ProjectDocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record UpdateProjectDocumentRequest(

        @NotBlank(message = "Document title is required")
        @Size(max = 255, message = "Document title must not exceed 255 characters")
        String title,

        @NotNull(message = "Document type is required")
        ProjectDocumentType documentType,

        @NotBlank(message = "Document URL is required")
        @Size(max = 1000, message = "Document URL must not exceed 1000 characters")
        String documentUrl,

        @Size(max = 255, message = "File name must not exceed 255 characters")
        String fileName,

        @Size(max = 100, message = "MIME type must not exceed 100 characters")
        String mimeType,

        @PositiveOrZero(message = "File size must be zero or positive")
        Long fileSizeBytes,

        String description,
        Boolean publicVisible,
        Boolean active
) {
}