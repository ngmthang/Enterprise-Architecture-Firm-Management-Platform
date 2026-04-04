package com.example.architectureplatform.project.exception;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException(Long id) {
        super("Project not found with id: " + id);
    }

    public ProjectNotFoundException(String code) {
        super("Project not found with code: " + code);
    }
}