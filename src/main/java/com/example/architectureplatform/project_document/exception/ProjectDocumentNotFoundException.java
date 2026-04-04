package com.example.architectureplatform.project_document.exception;

public class ProjectDocumentNotFoundException extends RuntimeException {

    public ProjectDocumentNotFoundException(Long id) {
        super("Project document not found with id: " + id);
    }
}