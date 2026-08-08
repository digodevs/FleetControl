package com.fleetcontrol.service;

import com.fleetcontrol.dto.DashboardResponse;
import com.fleetcontrol.entity.VehicleStatus;
import com.fleetcontrol.entity.VehicleType;
import com.fleetcontrol.repository.VehicleRepository;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private static final int MONTH_WINDOW = 6;
    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

    private final VehicleRepository vehicleRepository;

    public DashboardService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime thisMonthStart = now.withDayOfMonth(1).toLocalDate().atStartOfDay().atOffset(now.getOffset());
        OffsetDateTime lastMonthStart = thisMonthStart.minusMonths(1);
        OffsetDateTime nextMonthStart = thisMonthStart.plusMonths(1);
        OffsetDateTime monthWindowStart = thisMonthStart.minusMonths(MONTH_WINDOW - 1L);

        return new DashboardResponse(
                vehicleRepository.count(),
                vehicleRepository.countByStatus(VehicleStatus.AVAILABLE),
                vehicleRepository.countByStatus(VehicleStatus.IN_USE),
                vehicleRepository.countByStatus(VehicleStatus.MAINTENANCE),
                vehicleRepository.countByStatus(VehicleStatus.INACTIVE),
                vehicleRepository.countCreatedBetween(thisMonthStart, nextMonthStart),
                vehicleRepository.countCreatedBetween(lastMonthStart, thisMonthStart),
                vehiclesByType(),
                vehiclesByStatus(),
                registrationsByMonth(monthWindowStart, nextMonthStart)
        );
    }

    private List<DashboardResponse.TypeCount> vehiclesByType() {
        Map<VehicleType, Long> counts = new LinkedHashMap<>();
        Arrays.stream(VehicleType.values()).forEach(type -> counts.put(type, 0L));
        vehicleRepository.countByType().forEach(row -> counts.put(row.getType(), row.getTotal()));

        return counts.entrySet().stream()
                .map(entry -> new DashboardResponse.TypeCount(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<DashboardResponse.StatusCount> vehiclesByStatus() {
        Map<VehicleStatus, Long> counts = new LinkedHashMap<>();
        Arrays.stream(VehicleStatus.values()).forEach(status -> counts.put(status, 0L));
        vehicleRepository.countByStatusGrouped().forEach(row -> counts.put(row.getStatus(), row.getTotal()));

        return counts.entrySet().stream()
                .map(entry -> new DashboardResponse.StatusCount(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<DashboardResponse.MonthlyVehicleCount> registrationsByMonth(
            OffsetDateTime start,
            OffsetDateTime end
    ) {
        Map<String, Long> counts = new LinkedHashMap<>();
        YearMonth firstMonth = YearMonth.from(start);

        for (int i = 0; i < MONTH_WINDOW; i++) {
            counts.put(firstMonth.plusMonths(i).format(MONTH_FORMATTER), 0L);
        }

        vehicleRepository.countCreatedByMonth(start, end)
                .forEach(row -> counts.put(row.getMonth(), row.getTotal()));

        return counts.entrySet().stream()
                .map(entry -> new DashboardResponse.MonthlyVehicleCount(entry.getKey(), entry.getValue()))
                .toList();
    }
}
