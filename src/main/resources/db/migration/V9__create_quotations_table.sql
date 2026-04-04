CREATE TABLE quotations (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    project_id BIGINT,
    consultation_id BIGINT,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    subtotal_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    issue_date DATE,
    valid_until DATE,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    scope_summary TEXT,
    terms_and_conditions TEXT,
    notes TEXT,
    public_token VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_quotations_code UNIQUE (code),
    CONSTRAINT uk_quotations_public_token UNIQUE (public_token),

    CONSTRAINT fk_quotations_project
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,

    CONSTRAINT fk_quotations_consultation
        FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE SET NULL,

    CONSTRAINT chk_quotations_subtotal_non_negative
        CHECK (subtotal_amount >= 0),

    CONSTRAINT chk_quotations_tax_non_negative
        CHECK (tax_amount >= 0),

    CONSTRAINT chk_quotations_discount_non_negative
        CHECK (discount_amount >= 0),

    CONSTRAINT chk_quotations_total_non_negative
        CHECK (total_amount >= 0),

    CONSTRAINT chk_quotations_valid_until_date
        CHECK (
            valid_until IS NULL
                OR issue_date IS NULL
                OR valid_until >= issue_date
            )
);

CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_project_id ON quotations(project_id);
CREATE INDEX idx_quotations_consultation_id ON quotations(consultation_id);
CREATE INDEX idx_quotations_active ON quotations(active);
CREATE INDEX idx_quotations_client_name ON quotations(client_name);