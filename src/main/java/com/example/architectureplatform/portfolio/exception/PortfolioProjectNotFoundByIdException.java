package com.example.architectureplatform.portfolio.exception;

public class PortfolioProjectNotFoundByIdException extends RuntimeException {
  public PortfolioProjectNotFoundByIdException(String message) {
    super(message);
  }
}
