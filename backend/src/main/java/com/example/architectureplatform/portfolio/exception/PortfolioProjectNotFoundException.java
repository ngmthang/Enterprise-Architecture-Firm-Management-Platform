package com.example.architectureplatform.portfolio.exception;

public class PortfolioProjectNotFoundException extends RuntimeException {

    public PortfolioProjectNotFoundException(String slug) {
        super("Portfolio project not found with slug: " + slug);
    }
}