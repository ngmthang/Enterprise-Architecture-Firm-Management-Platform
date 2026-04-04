package com.example.architectureplatform.service_catalog.exception;

public class ServiceOfferingNotFoundException extends RuntimeException {
  public ServiceOfferingNotFoundException(String message) {
    super(message);
  }
}
