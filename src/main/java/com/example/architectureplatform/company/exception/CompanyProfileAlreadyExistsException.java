package com.example.architectureplatform.company.exception;

public class CompanyProfileAlreadyExistsException extends RuntimeException {
  public CompanyProfileAlreadyExistsException(String message) {
    super(message);
  }
}
