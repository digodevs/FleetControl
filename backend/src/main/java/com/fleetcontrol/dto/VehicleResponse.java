package com.fleetcontrol.dto;

import com.fleetcontrol.entity.FuelType;
import com.fleetcontrol.entity.VehicleStatus;
import com.fleetcontrol.entity.VehicleType;
import java.time.OffsetDateTime;
import java.util.UUID;

public record VehicleResponse(
        UUID id,
        String licensePlate,
        String brand,
        String model,
        Integer year,
        VehicleType type,
        FuelType fuelType,
        Long mileage,
        VehicleStatus status,
        String color,
        String renavam,
        String chassis,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}

