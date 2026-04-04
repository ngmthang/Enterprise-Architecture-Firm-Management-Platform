CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    expense_reference VARCHAR(100) UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    expense_date DATE NOT NULL,
    vendor_name VARCHAR(255),
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_expenses_amount_positive
    CHECK (amount > 0)
);

CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);