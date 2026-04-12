CREATE TABLE portfolio_projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    short_description VARCHAR(500) NOT NULL,
    full_description TEXT,
    location VARCHAR(255),
    project_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    cover_image_url VARCHAR(500),
    completed_at DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portfolio_projects_slug
    ON portfolio_projects(slug);

CREATE INDEX idx_portfolio_projects_featured
    ON portfolio_projects(featured);

CREATE INDEX idx_portfolio_projects_display_order
    ON portfolio_projects(display_order);

CREATE INDEX  idx_portfolio_projects_created_at
    ON portfolio_projects(created_at);