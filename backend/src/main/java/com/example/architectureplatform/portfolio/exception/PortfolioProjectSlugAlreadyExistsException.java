package com.example.architectureplatform.portfolio.exception;

public class PortfolioProjectSlugAlreadyExistsException extends RuntimeException {
    public PortfolioProjectSlugAlreadyExistsException(String slug) {

        super("Portfolio project slug already exists: " + slug);
    }
}
