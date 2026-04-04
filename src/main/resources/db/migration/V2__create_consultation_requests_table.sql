CREATE TABLE consultation_requests(
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    project_type VARCHAR(100) NOT NULL,
    project_location VARCHAR(255),
    project_budget VARCHAR(100),
    preferred_contact_method VARCHAR(30) NOT NULL,
    project_details TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consultation_requests_email
    ON consultation_requests(email);

CREATE INDEX idx_consultation_requests_status
    ON consultation_requests(status);

CREATE INDEX idx_consultation_requests_created_at
    ON consultation_requests(created_at);