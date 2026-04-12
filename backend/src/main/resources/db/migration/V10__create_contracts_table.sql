CREATE TABLE contracts (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    project_id BIGINT,
    quotation_id BIGINT,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    contract_date DATE,
    start_date DATE,
    end_date DATE,
    signed_by_client BOOLEAN NOT NULL DEFAULT FALSE,
    signed_by_company BOOLEAN NOT NULL DEFAULT FALSE,
    signed_at TIMESTAMP,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    contract_value NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL,
    document_url VARCHAR(1000),
    scope_summary TEXT,
    terms_and_conditions TEXT,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_contracts_code UNIQUE (code),

    CONSTRAINT fk_contracts_project
       FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,

    CONSTRAINT fk_contracts_quotation
       FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE SET NULL,

    CONSTRAINT chk_contracts_value_non_negative
       CHECK (contract_value >= 0),

    CONSTRAINT chk_contracts_end_date_order
       CHECK (
           end_date IS NULL
               OR start_date IS NULL
               OR end_date >= start_date
           )
);

CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_contracts_quotation_id ON contracts(quotation_id);
CREATE INDEX idx_contracts_active ON contracts(active);
CREATE INDEX idx_contracts_client_name ON contracts(client_name);