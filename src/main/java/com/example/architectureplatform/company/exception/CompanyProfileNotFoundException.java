package com.example.architectureplatform.company.exception;

public class CompanyProfileNotFoundException extends RuntimeException {

    public CompanyProfileNotFoundException() {
        super("Company profile not found");
    }
}