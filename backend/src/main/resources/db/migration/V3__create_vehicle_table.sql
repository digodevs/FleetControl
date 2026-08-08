CREATE TABLE vehicles (
    id UUID PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL,
    brand VARCHAR(80) NOT NULL,
    model VARCHAR(80) NOT NULL,
    year INTEGER NOT NULL,
    type VARCHAR(30) NOT NULL,
    fuel_type VARCHAR(30) NOT NULL,
    mileage BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    color VARCHAR(50),
    renavam VARCHAR(20),
    chassis VARCHAR(40),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_vehicles_license_plate UNIQUE (license_plate),
    CONSTRAINT chk_vehicles_year CHECK (year >= 1900 AND year <= 2100),
    CONSTRAINT chk_vehicles_mileage CHECK (mileage >= 0),
    CONSTRAINT chk_vehicles_status CHECK (status IN ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'INACTIVE')),
    CONSTRAINT chk_vehicles_type CHECK (type IN ('CAR', 'MOTORCYCLE', 'VAN', 'TRUCK', 'BUS', 'OTHER')),
    CONSTRAINT chk_vehicles_fuel_type CHECK (fuel_type IN ('GASOLINE', 'ETHANOL', 'FLEX', 'DIESEL', 'ELECTRIC', 'HYBRID', 'OTHER'))
);

CREATE UNIQUE INDEX uk_vehicles_renavam_not_blank
    ON vehicles (renavam)
    WHERE renavam IS NOT NULL AND renavam <> '';

CREATE UNIQUE INDEX uk_vehicles_chassis_not_blank
    ON vehicles (chassis)
    WHERE chassis IS NOT NULL AND chassis <> '';

CREATE INDEX idx_vehicles_status ON vehicles (status);
CREATE INDEX idx_vehicles_type ON vehicles (type);
CREATE INDEX idx_vehicles_brand_model ON vehicles (brand, model);

