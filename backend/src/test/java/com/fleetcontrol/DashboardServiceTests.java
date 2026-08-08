package com.fleetcontrol;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.fleetcontrol.dto.DashboardResponse;
import com.fleetcontrol.entity.VehicleStatus;
import com.fleetcontrol.entity.VehicleType;
import com.fleetcontrol.repository.VehicleRepository;
import com.fleetcontrol.service.DashboardService;
import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTests {

    @Mock
    private VehicleRepository vehicleRepository;

    @Test
    void getDashboardReturnsAggregatedVehicleMetrics() {
        DashboardService dashboardService = new DashboardService(vehicleRepository);

        when(vehicleRepository.count()).thenReturn(10L);
        when(vehicleRepository.countByStatus(VehicleStatus.AVAILABLE)).thenReturn(4L);
        when(vehicleRepository.countByStatus(VehicleStatus.IN_USE)).thenReturn(2L);
        when(vehicleRepository.countByStatus(VehicleStatus.MAINTENANCE)).thenReturn(3L);
        when(vehicleRepository.countByStatus(VehicleStatus.INACTIVE)).thenReturn(1L);
        when(vehicleRepository.countCreatedBetween(any(OffsetDateTime.class), any(OffsetDateTime.class)))
                .thenReturn(5L, 2L);
        when(vehicleRepository.countByType()).thenReturn(List.of(typeCount(VehicleType.CAR, 7L)));
        when(vehicleRepository.countByStatusGrouped()).thenReturn(List.of(statusCount(VehicleStatus.AVAILABLE, 4L)));
        when(vehicleRepository.countCreatedByMonth(any(OffsetDateTime.class), any(OffsetDateTime.class)))
                .thenReturn(List.of(monthCount("2026-08", 5L)));

        DashboardResponse response = dashboardService.getDashboard();

        assertThat(response.totalVehicles()).isEqualTo(10);
        assertThat(response.availableVehicles()).isEqualTo(4);
        assertThat(response.inUseVehicles()).isEqualTo(2);
        assertThat(response.maintenanceVehicles()).isEqualTo(3);
        assertThat(response.inactiveVehicles()).isEqualTo(1);
        assertThat(response.vehiclesCreatedThisMonth()).isEqualTo(5);
        assertThat(response.vehiclesCreatedLastMonth()).isEqualTo(2);
        assertThat(response.vehiclesByType()).hasSize(VehicleType.values().length);
        assertThat(response.vehiclesByStatus()).hasSize(VehicleStatus.values().length);
        assertThat(response.vehicleRegistrationsByMonth()).hasSize(6);
    }

    private VehicleRepository.VehicleTypeCount typeCount(VehicleType type, long total) {
        return new VehicleRepository.VehicleTypeCount() {
            @Override
            public VehicleType getType() {
                return type;
            }

            @Override
            public long getTotal() {
                return total;
            }
        };
    }

    private VehicleRepository.VehicleStatusCount statusCount(VehicleStatus status, long total) {
        return new VehicleRepository.VehicleStatusCount() {
            @Override
            public VehicleStatus getStatus() {
                return status;
            }

            @Override
            public long getTotal() {
                return total;
            }
        };
    }

    private VehicleRepository.MonthlyVehicleCount monthCount(String month, long total) {
        return new VehicleRepository.MonthlyVehicleCount() {
            @Override
            public String getMonth() {
                return month;
            }

            @Override
            public long getTotal() {
                return total;
            }
        };
    }
}

