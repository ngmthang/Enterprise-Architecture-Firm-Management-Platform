package com.example.architectureplatform.project.exception;

public class ProjectAlreadyExistsException extends RuntimeException {

    public ProjectAlreadyExistsException(String code) {
        super("Project already exists with code: " + code);
    }
}