package com.example.architectureplatform.report.service;

import com.example.architectureplatform.report.dto.request.CreateReportRequest;
import com.example.architectureplatform.report.dto.request.UpdateReportRequest;
import com.example.architectureplatform.report.dto.response.ReportResponse;
import com.example.architectureplatform.report.enums.ReportType;

import java.util.List;

public interface ReportService {

    ReportResponse createReport(CreateReportRequest request);

    ReportResponse updateReport(Long reportId, UpdateReportRequest request);

    ReportResponse getReportById(Long reportId);

    List<ReportResponse> getAllReports();

    List<ReportResponse> getReportsByType(ReportType reportType);

    void deleteReport(Long reportId);
}