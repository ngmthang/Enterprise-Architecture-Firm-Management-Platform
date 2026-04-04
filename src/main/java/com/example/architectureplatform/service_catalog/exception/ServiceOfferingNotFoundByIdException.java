package com.example.architectureplatform.service_catalog.exception;

public class ServiceOfferingNotFoundByIdException extends RuntimeException {
  public ServiceOfferingNotFoundByIdException(String message) {
    super(message);
  }
}
