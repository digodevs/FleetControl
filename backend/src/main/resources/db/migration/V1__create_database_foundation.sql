CREATE TABLE app_schema_info (
    id SMALLINT PRIMARY KEY,
    application_name VARCHAR(100) NOT NULL,
    schema_version VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_schema_info (id, application_name, schema_version)
VALUES (1, 'FleetControl', '1.0.0');

