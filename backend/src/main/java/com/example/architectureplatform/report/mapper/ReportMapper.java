package com.example.architectureplatform.report.mapper;

import com.example.architectureplatform.report.dto.response.ReportResponse;
import com.example.architectureplatform.report.entity.Report;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {

    public ReportResponse toResponse(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getName(),
                report.getDescription(),
                report.getReportType(),
                report.getGeneratedBy(),
                report.getReportPeriodStart(),
                report.getReportPeriodEnd(),
                report.getGeneratedAt(),
                report.getCreatedAt(),
                report.getUpdatedAt()
        );
    }
}