package com.fleetcontrol.mapper;

import com.fleetcontrol.dto.VehicleResponse;
import com.fleetcontrol.entity.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    public VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getLicensePlate(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getType(),
                vehicle.getFuelType(),
                vehicle.getMileage(),
                vehicle.getStatus(),
                vehicle.getColor(),
                vehicle.getRenavam(),
                vehicle.getChassis(),
                vehicle.getCreatedAt(),
                vehicle.getUpdatedAt()
        );
    }
}

