package com.example.architectureplatform.project_document.exception;

public class ProjectDocumentAlreadyExistsException extends RuntimeException {

    public ProjectDocumentAlreadyExistsException(Long projectId, String title) {
        super("Project document already exists for project id " + projectId + " with title: " + title);
    }
}