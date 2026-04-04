package com.example.architectureplatform.portfolio.exception;

public class PortfolioProjectNotFoundByIdException extends RuntimeException {

    public PortfolioProjectNotFoundByIdException(Long id) {
        super("Portfolio project not found with id: " + id);
    }
}