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
        @NotBlank(message = "A placa é obrigatória.")
        @Size(min = 7, max = 20, message = "A placa deve ter entre 7 e 20 caracteres.")
        String licensePlate,

        @NotBlank(message = "A marca é obrigatória.")
        @Size(max = 80, message = "A marca deve ter no máximo 80 caracteres.")
        String brand,

        @NotBlank(message = "O modelo é obrigatório.")
        @Size(max = 80, message = "O modelo deve ter no máximo 80 caracteres.")
        String model,

        @NotNull(message = "O ano é obrigatório.")
        @Min(value = 1900, message = "O ano deve ser maior ou igual a 1900.")
        @Max(value = 2100, message = "O ano deve ser menor ou igual a 2100.")
        Integer year,

        @NotNull(message = "O tipo é obrigatório.")
        VehicleType type,

        @NotNull(message = "O combustível é obrigatório.")
        FuelType fuelType,

        @NotNull(message = "A quilometragem é obrigatória.")
        @PositiveOrZero(message = "A quilometragem deve ser maior ou igual a zero.")
        Long mileage,

        @NotNull(message = "O status é obrigatório.")
        VehicleStatus status,

        @Size(max = 50, message = "A cor deve ter no máximo 50 caracteres.")
        String color,

        @Size(max = 20, message = "O RENAVAM deve ter no máximo 20 caracteres.")
        String renavam,

        @Size(max = 40, message = "O chassi deve ter no máximo 40 caracteres.")
        String chassis
) {
}
