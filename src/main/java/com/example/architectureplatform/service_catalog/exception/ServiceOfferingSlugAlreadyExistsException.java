package com.example.architectureplatform.service_catalog.exception;

public class ServiceOfferingSlugAlreadyExistsException extends RuntimeException {
  public ServiceOfferingSlugAlreadyExistsException(String message) {
    super(message);
  }
}
