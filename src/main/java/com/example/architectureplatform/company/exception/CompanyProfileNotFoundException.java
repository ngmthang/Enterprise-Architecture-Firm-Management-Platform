package com.example.architectureplatform.company.exception;

public class CompanyProfileNotFoundException extends RuntimeException {
  public CompanyProfileNotFoundException(String message) {
    super(message);
  }
}
