package com.example.architectureplatform.service_catalog.exception;

public class ServiceOfferingSlugAlreadyExistsException extends RuntimeException {

    public ServiceOfferingSlugAlreadyExistsException(String slug) {
        super("Service offering slug already exists: " + slug);
    }
}