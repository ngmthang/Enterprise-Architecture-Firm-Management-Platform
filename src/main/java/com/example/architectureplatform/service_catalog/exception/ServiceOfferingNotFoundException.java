package com.example.architectureplatform.service_catalog.exception;

public class ServiceOfferingNotFoundException extends RuntimeException {

    public ServiceOfferingNotFoundException(String slug) {
        super("Service offering not found with slug: " + slug);
    }
}