CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    project_id BIGINT,
    contract_id BIGINT,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    invoice_date DATE,
    due_date DATE,
    paid_date DATE,
    currency VARCHAR(10) NOT NULL,
    subtotal_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(15,2) NOT NULL DEFAULT 0,
    balance_due NUMERIC(15,2) NOT NULL DEFAULT 0,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    document_url VARCHAR(1000),
    description TEXT,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_invoices_code UNIQUE (code),

    CONSTRAINT fk_invoices_project
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,

    CONSTRAINT fk_invoices_contract
      FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL,

    CONSTRAINT chk_invoices_subtotal_non_negative
      CHECK (subtotal_amount >= 0),

    CONSTRAINT chk_invoices_tax_non_negative
      CHECK (tax_amount >= 0),

    CONSTRAINT chk_invoices_discount_non_negative
      CHECK (discount_amount >= 0),

    CONSTRAINT chk_invoices_total_non_negative
      CHECK (total_amount >= 0),

    CONSTRAINT chk_invoices_amount_paid_non_negative
      CHECK (amount_paid >= 0),

    CONSTRAINT chk_invoices_balance_due_non_negative
      CHECK (balance_due >= 0),

    CONSTRAINT chk_invoices_due_date_order
      CHECK (
          due_date IS NULL
              OR invoice_date IS NULL
              OR due_date >= invoice_date
          ),

    CONSTRAINT chk_invoices_paid_date_order
      CHECK (
          paid_date IS NULL
              OR invoice_date IS NULL
              OR paid_date >= invoice_date
          )
);

CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_contract_id ON invoices(contract_id);
CREATE INDEX idx_invoices_active ON invoices(active);
CREATE INDEX idx_invoices_client_name ON invoices(client_name);