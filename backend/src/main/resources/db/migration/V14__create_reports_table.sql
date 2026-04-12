CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL,
    generated_by VARCHAR(255),
    report_period_start DATE,
    report_period_end DATE,
    generated_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_report_type ON reports(report_type);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);
CREATE INDEX idx_reports_report_period_start ON reports(report_period_start);
CREATE INDEX idx_reports_report_period_end ON reports(report_period_end);