package com.example.architectureplatform.report.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.report.dto.request.CreateReportRequest;
import com.example.architectureplatform.report.dto.request.UpdateReportRequest;
import com.example.architectureplatform.report.dto.response.ReportResponse;
import com.example.architectureplatform.report.enums.ReportType;
import com.example.architectureplatform.report.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReportResponse>> createReport(
            @Valid @RequestBody CreateReportRequest request
    ) {
        ReportResponse response = reportService.createReport(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Report created successfully", response));
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<ApiResponse<ReportResponse>> updateReport(
            @PathVariable Long reportId,
            @Valid @RequestBody UpdateReportRequest request
    ) {
        ReportResponse response = reportService.updateReport(reportId, request);
        return ResponseEntity.ok(ApiResponse.success("Report updated successfully", response));
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ApiResponse<ReportResponse>> getReportById(@PathVariable Long reportId) {
        ReportResponse response = reportService.getReportById(reportId);
        return ResponseEntity.ok(ApiResponse.success("Report retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getAllReports() {
        List<ReportResponse> response = reportService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success("Reports retrieved successfully", response));
    }

    @GetMapping("/type/{reportType}")
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getReportsByType(@PathVariable ReportType reportType) {
        List<ReportResponse> response = reportService.getReportsByType(reportType);
        return ResponseEntity.ok(ApiResponse.success("Reports by type retrieved successfully", response));
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable Long reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.ok(ApiResponse.success("Report deleted successfully", null));
    }
}