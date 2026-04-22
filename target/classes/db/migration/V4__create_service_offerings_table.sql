CREATE TABLE service_offerings (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) not null,
    slug varchar(170) not null unique,
    short_description varchar(500) not null,
    full_description TEXT,
    icon varchar(100),
    featured boolean not null default false,
    display_order int not null default 0,
    active boolean not null default true,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create index idx_service_offerings_slug
    on service_offerings(slug);

create index idx_service_offerings_featured
    on service_offerings(featured);

create index idx_service_offerings_display_order
    on service_offerings(display_order);

create index idx_service_offerings_active
    on service_offerings(active);