CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    project_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    location VARCHAR(255),
    area_size_sqft NUMERIC(12,2),
    estimated_budget NUMERIC(15,2),
    start_date DATE,
    target_end_date DATE,
    actual_end_date DATE,
    description TEXT,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_projects_code UNIQUE (code),
    CONSTRAINT chk_projects_area_size_sqft_non_negative
      CHECK (area_size_sqft IS NULL OR area_size_sqft >= 0),
    CONSTRAINT chk_projects_estimated_budget_non_negative
      CHECK (estimated_budget IS NULL OR estimated_budget >= 0),
    CONSTRAINT chk_projects_date_order
      CHECK (
          target_end_date IS NULL
              OR start_date IS NULL
              OR target_end_date >= start_date
          ),
    CONSTRAINT chk_projects_actual_end_date_order
      CHECK (
          actual_end_date IS NULL
              OR start_date IS NULL
              OR actual_end_date >= start_date
          )
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_project_type ON projects(project_type);
CREATE INDEX idx_projects_active ON projects(active);
CREATE INDEX idx_projects_client_name ON projects(client_name);