package com.example.architectureplatform.report.exception;

public class InvalidReportPeriodException extends RuntimeException {

    public InvalidReportPeriodException() {
        super("Report period start date must be before or equal to report period end date");
    }
}