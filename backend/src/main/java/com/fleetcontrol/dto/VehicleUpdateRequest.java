package com.fleetcontrol.dto;

import com.fleetcontrol.entity.FuelType;
import com.fleetcontrol.entity.VehicleStatus;
import com.fleetcontrol.entity.VehicleType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record VehicleUpdateRequest(
        @NotBlank
        @Size(min = 7, max = 20)
        String licensePlate,

        @NotBlank
        @Size(max = 80)
        String brand,

        @NotBlank
        @Size(max = 80)
        String model,

        @NotNull
        @Min(1900)
        @Max(2100)
        Integer year,

        @NotNull
        VehicleType type,

        @NotNull
        FuelType fuelType,

        @NotNull
        @PositiveOrZero
        Long mileage,

        @NotNull
        VehicleStatus status,

        @Size(max = 50)
        String color,

        @Size(max = 20)
        String renavam,

        @Size(max = 40)
        String chassis
) {
}

