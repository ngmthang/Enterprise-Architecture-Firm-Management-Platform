package com.example.architectureplatform.report.repository;

import com.example.architectureplatform.report.entity.Report;
import com.example.architectureplatform.report.enums.ReportType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByReportTypeOrderByGeneratedAtDesc(ReportType reportType);
}