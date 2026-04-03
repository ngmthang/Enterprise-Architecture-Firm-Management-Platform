package com.example.architectureplatform.portfolio.exception;

public class PortfolioProjectSlugAlreadyExistsException extends RuntimeException {
  public PortfolioProjectSlugAlreadyExistsException(String message) {
    super(message);
  }
}
