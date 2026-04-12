package com.example.architectureplatform.service_catalog.exception;

public class ServiceOfferingNotFoundByIdException extends RuntimeException {

    public ServiceOfferingNotFoundByIdException(Long id) {
        super("Service offering not found with id: " + id);
    }
}