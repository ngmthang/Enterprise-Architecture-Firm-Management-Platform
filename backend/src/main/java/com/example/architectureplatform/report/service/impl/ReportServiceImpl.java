package com.example.architectureplatform.report.service.impl;

import com.example.architectureplatform.report.dto.request.CreateReportRequest;
import com.example.architectureplatform.report.dto.request.UpdateReportRequest;
import com.example.architectureplatform.report.dto.response.ReportResponse;
import com.example.architectureplatform.report.entity.Report;
import com.example.architectureplatform.report.enums.ReportType;
import com.example.architectureplatform.report.exception.InvalidReportPeriodException;
import com.example.architectureplatform.report.exception.ReportNotFoundException;
import com.example.architectureplatform.report.mapper.ReportMapper;
import com.example.architectureplatform.report.repository.ReportRepository;
import com.example.architectureplatform.report.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;

    public ReportServiceImpl(ReportRepository reportRepository, ReportMapper reportMapper) {
        this.reportRepository = reportRepository;
        this.reportMapper = reportMapper;
    }

    @Override
    public ReportResponse createReport(CreateReportRequest request) {
        validateReportPeriod(request.reportPeriodStart(), request.reportPeriodEnd());

        Report report = new Report();
        report.setName(request.name().trim());
        report.setDescription(request.description());
        report.setReportType(request.reportType());
        report.setGeneratedBy(request.generatedBy() == null ? null : request.generatedBy().trim());
        report.setReportPeriodStart(request.reportPeriodStart());
        report.setReportPeriodEnd(request.reportPeriodEnd());
        report.setGeneratedAt(request.generatedAt());

        Report savedReport = reportRepository.save(report);
        return reportMapper.toResponse(savedReport);
    }

    @Override
    public ReportResponse updateReport(Long reportId, UpdateReportRequest request) {
        validateReportPeriod(request.reportPeriodStart(), request.reportPeriodEnd());

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ReportNotFoundException(reportId));

        report.setName(request.name().trim());
        report.setDescription(request.description());
        report.setReportType(request.reportType());
        report.setGeneratedBy(request.generatedBy() == null ? null : request.generatedBy().trim());
        report.setReportPeriodStart(request.reportPeriodStart());
        report.setReportPeriodEnd(request.reportPeriodEnd());
        report.setGeneratedAt(request.generatedAt());

        Report updatedReport = reportRepository.save(report);
        return reportMapper.toResponse(updatedReport);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ReportNotFoundException(reportId));

        return reportMapper.toResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(reportMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getReportsByType(ReportType reportType) {
        return reportRepository.findByReportTypeOrderByGeneratedAtDesc(reportType)
                .stream()
                .map(reportMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ReportNotFoundException(reportId));

        reportRepository.delete(report);
    }

    private void validateReportPeriod(java.time.LocalDate start, java.time.LocalDate end) {
        if (start != null && end != null && start.isAfter(end)) {
            throw new InvalidReportPeriodException();
        }
    }
}