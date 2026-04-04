package com.example.architectureplatform.company.exception;

public class CompanyProfileAlreadyExistsException extends RuntimeException {

    public CompanyProfileAlreadyExistsException() {
        super("Company profile already exists");
    }
}