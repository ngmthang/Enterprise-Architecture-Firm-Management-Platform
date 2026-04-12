package com.example.architectureplatform.report.exception;

public class ReportNotFoundException extends RuntimeException {

    public ReportNotFoundException(Long reportId) {
        super("Report not found with id: " + reportId);
    }
}