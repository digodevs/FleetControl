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
        @NotBlank(message = "A placa e obrigatoria.")
        @Size(min = 7, max = 20, message = "A placa deve ter entre 7 e 20 caracteres.")
        String licensePlate,

        @NotBlank(message = "A marca e obrigatoria.")
        @Size(max = 80, message = "A marca deve ter no maximo 80 caracteres.")
        String brand,

        @NotBlank(message = "O modelo e obrigatorio.")
        @Size(max = 80, message = "O modelo deve ter no maximo 80 caracteres.")
        String model,

        @NotNull(message = "O ano e obrigatorio.")
        @Min(value = 1900, message = "O ano deve ser maior ou igual a 1900.")
        @Max(value = 2100, message = "O ano deve ser menor ou igual a 2100.")
        Integer year,

        @NotNull(message = "O tipo e obrigatorio.")
        VehicleType type,

        @NotNull(message = "O combustivel e obrigatorio.")
        FuelType fuelType,

        @NotNull(message = "A quilometragem e obrigatoria.")
        @PositiveOrZero(message = "A quilometragem deve ser maior ou igual a zero.")
        Long mileage,

        @NotNull(message = "O status e obrigatorio.")
        VehicleStatus status,

        @Size(max = 50, message = "A cor deve ter no maximo 50 caracteres.")
        String color,

        @Size(max = 20, message = "O RENAVAM deve ter no maximo 20 caracteres.")
        String renavam,

        @Size(max = 40, message = "O chassi deve ter no maximo 40 caracteres.")
        String chassis
) {
}
