package com.example.architectureplatform.report.entity;

import com.example.architectureplatform.report.enums.ReportType;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "reports",
        indexes = {
                @Index(name = "idx_reports_report_type", columnList = "report_type"),
                @Index(name = "idx_reports_generated_at", columnList = "generated_at"),
                @Index(name = "idx_reports_report_period_start", columnList = "report_period_start"),
                @Index(name = "idx_reports_report_period_end", columnList = "report_period_end")
        }
)
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false, length = 50)
    private ReportType reportType;

    @Column(name = "generated_by", length = 255)
    private String generatedBy;

    @Column(name = "report_period_start")
    private LocalDate reportPeriodStart;

    @Column(name = "report_period_end")
    private LocalDate reportPeriodEnd;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.generatedAt == null) {
            this.generatedAt = now;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Report() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ReportType getReportType() {
        return reportType;
    }

    public void setReportType(ReportType reportType) {
        this.reportType = reportType;
    }

    public String getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(String generatedBy) {
        this.generatedBy = generatedBy;
    }

    public LocalDate getReportPeriodStart() {
        return reportPeriodStart;
    }

    public void setReportPeriodStart(LocalDate reportPeriodStart) {
        this.reportPeriodStart = reportPeriodStart;
    }

    public LocalDate getReportPeriodEnd() {
        return reportPeriodEnd;
    }

    public void setReportPeriodEnd(LocalDate reportPeriodEnd) {
        this.reportPeriodEnd = reportPeriodEnd;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}