package com.fleetcontrol.repository;

import com.fleetcontrol.entity.Vehicle;
import com.fleetcontrol.entity.VehicleStatus;
import com.fleetcontrol.entity.VehicleType;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID>, JpaSpecificationExecutor<Vehicle> {

    boolean existsByLicensePlate(String licensePlate);

    boolean existsByLicensePlateAndIdNot(String licensePlate, UUID id);

    boolean existsByRenavam(String renavam);

    boolean existsByRenavamAndIdNot(String renavam, UUID id);

    boolean existsByChassis(String chassis);

    boolean existsByChassisAndIdNot(String chassis, UUID id);

    long countByStatus(VehicleStatus status);

    @Query("select count(v) from Vehicle v where v.createdAt >= :start and v.createdAt < :end")
    long countCreatedBetween(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("select v.type as type, count(v) as total from Vehicle v group by v.type")
    List<VehicleTypeCount> countByType();

    @Query("select v.status as status, count(v) as total from Vehicle v group by v.status")
    List<VehicleStatusCount> countByStatusGrouped();

    @Query(
            value = """
                    select to_char(date_trunc('month', created_at), 'YYYY-MM') as month, count(*) as total
                    from vehicles
                    where created_at >= :start and created_at < :end
                    group by date_trunc('month', created_at)
                    order by date_trunc('month', created_at)
                    """,
            nativeQuery = true
    )
    List<MonthlyVehicleCount> countCreatedByMonth(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    interface VehicleTypeCount {
        VehicleType getType();

        long getTotal();
    }

    interface VehicleStatusCount {
        VehicleStatus getStatus();

        long getTotal();
    }

    interface MonthlyVehicleCount {
        String getMonth();

        long getTotal();
    }
}
