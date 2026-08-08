package com.fleetcontrol.dto;

import com.fleetcontrol.entity.VehicleStatus;
import com.fleetcontrol.entity.VehicleType;
import java.util.List;

public record DashboardResponse(
        long totalVehicles,
        long availableVehicles,
        long inUseVehicles,
        long maintenanceVehicles,
        long inactiveVehicles,
        long vehiclesCreatedThisMonth,
        long vehiclesCreatedLastMonth,
        List<TypeCount> vehiclesByType,
        List<StatusCount> vehiclesByStatus,
        List<MonthlyVehicleCount> vehicleRegistrationsByMonth
) {

    public record TypeCount(VehicleType type, long count) {
    }

    public record StatusCount(VehicleStatus status, long count) {
    }

    public record MonthlyVehicleCount(String month, long count) {
    }
}
