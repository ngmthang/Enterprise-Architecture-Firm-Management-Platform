CREATE TABLE team_members (
                              id BIGSERIAL PRIMARY KEY,
                              full_name VARCHAR(150) NOT NULL,
                              job_title VARCHAR(150) NOT NULL,
                              short_bio VARCHAR(500) NOT NULL,
                              full_bio TEXT,
                              profile_image_url VARCHAR(500),
                              email VARCHAR(150) UNIQUE,
                              phone VARCHAR(30),
                              linkedin_url VARCHAR(500),
                              display_order INT NOT NULL DEFAULT 0,
                              featured BOOLEAN NOT NULL DEFAULT FALSE,
                              active BOOLEAN NOT NULL DEFAULT TRUE,
                              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_members_display_order
    ON team_members(display_order);

CREATE INDEX idx_team_members_featured
    ON team_members(featured);

CREATE INDEX idx_team_members_active
    ON team_members(active);

CREATE INDEX idx_team_members_created_at
    ON team_members(created_at);