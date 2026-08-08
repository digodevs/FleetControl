package com.fleetcontrol.service;

import com.fleetcontrol.dto.VehicleCreateRequest;
import com.fleetcontrol.dto.VehicleResponse;
import com.fleetcontrol.dto.VehicleUpdateRequest;
import com.fleetcontrol.entity.Vehicle;
import com.fleetcontrol.entity.VehicleStatus;
import com.fleetcontrol.entity.VehicleType;
import com.fleetcontrol.exception.DuplicateChassisException;
import com.fleetcontrol.exception.DuplicateLicensePlateException;
import com.fleetcontrol.exception.DuplicateRenavamException;
import com.fleetcontrol.exception.InvalidMileageException;
import com.fleetcontrol.exception.VehicleNotFoundException;
import com.fleetcontrol.mapper.VehicleMapper;
import com.fleetcontrol.repository.VehicleRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleService(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
    }

    @Transactional
    public VehicleResponse create(VehicleCreateRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate(normalizeLicensePlate(request.licensePlate()));
        vehicle.setBrand(normalizeRequiredText(request.brand()));
        vehicle.setModel(normalizeRequiredText(request.model()));
        vehicle.setYear(request.year());
        vehicle.setType(request.type());
        vehicle.setFuelType(request.fuelType());
        vehicle.setMileage(validateNonNegativeMileage(request.mileage()));
        vehicle.setStatus(request.status() == null ? VehicleStatus.AVAILABLE : request.status());
        vehicle.setColor(normalizeOptionalText(request.color()));
        vehicle.setRenavam(normalizeOptionalUppercase(request.renavam()));
        vehicle.setChassis(normalizeOptionalUppercase(request.chassis()));

        validateUniqueFields(vehicle, null);

        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Transactional(readOnly = true)
    public VehicleResponse findById(UUID id) {
        return vehicleMapper.toResponse(getVehicle(id));
    }

    @Transactional(readOnly = true)
    public Page<VehicleResponse> list(
            VehicleStatus status,
            VehicleType type,
            String search,
            Pageable pageable
    ) {
        return vehicleRepository.findAll(buildSpecification(status, type, search), pageable)
                .map(vehicleMapper::toResponse);
    }

    @Transactional
    public VehicleResponse update(UUID id, VehicleUpdateRequest request) {
        Vehicle vehicle = getVehicle(id);
        Long mileage = validateNonNegativeMileage(request.mileage());

        if (mileage < vehicle.getMileage()) {
            throw new InvalidMileageException("A quilometragem não pode ser menor que o valor atual.");
        }

        vehicle.setLicensePlate(normalizeLicensePlate(request.licensePlate()));
        vehicle.setBrand(normalizeRequiredText(request.brand()));
        vehicle.setModel(normalizeRequiredText(request.model()));
        vehicle.setYear(request.year());
        vehicle.setType(request.type());
        vehicle.setFuelType(request.fuelType());
        vehicle.setMileage(mileage);
        vehicle.setStatus(request.status());
        vehicle.setColor(normalizeOptionalText(request.color()));
        vehicle.setRenavam(normalizeOptionalUppercase(request.renavam()));
        vehicle.setChassis(normalizeOptionalUppercase(request.chassis()));

        validateUniqueFields(vehicle, id);

        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Transactional
    public void delete(UUID id) {
        Vehicle vehicle = getVehicle(id);
        vehicle.setStatus(VehicleStatus.INACTIVE);
        vehicleRepository.save(vehicle);
    }

    private Vehicle getVehicle(UUID id) {
        return vehicleRepository.findById(id).orElseThrow(VehicleNotFoundException::new);
    }

    private void validateUniqueFields(Vehicle vehicle, UUID currentId) {
        if (currentId == null
                ? vehicleRepository.existsByLicensePlate(vehicle.getLicensePlate())
                : vehicleRepository.existsByLicensePlateAndIdNot(vehicle.getLicensePlate(), currentId)) {
            throw new DuplicateLicensePlateException();
        }

        if (hasText(vehicle.getRenavam()) && (currentId == null
                ? vehicleRepository.existsByRenavam(vehicle.getRenavam())
                : vehicleRepository.existsByRenavamAndIdNot(vehicle.getRenavam(), currentId))) {
            throw new DuplicateRenavamException();
        }

        if (hasText(vehicle.getChassis()) && (currentId == null
                ? vehicleRepository.existsByChassis(vehicle.getChassis())
                : vehicleRepository.existsByChassisAndIdNot(vehicle.getChassis(), currentId))) {
            throw new DuplicateChassisException();
        }
    }

    private Specification<Vehicle> buildSpecification(VehicleStatus status, VehicleType type, String search) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }

            if (hasText(search)) {
                String normalizedSearch = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                String licensePlateSearch = "%" + normalizeLicensePlate(search) + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), normalizedSearch),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("model")), normalizedSearch),
                        criteriaBuilder.like(root.get("licensePlate"), licensePlateSearch)
                ));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Long validateNonNegativeMileage(Long mileage) {
        if (mileage == null || mileage < 0) {
            throw new InvalidMileageException("A quilometragem não pode ser negativa.");
        }
        return mileage;
    }

    private String normalizeLicensePlate(String licensePlate) {
        return licensePlate.trim()
                .replace("-", "")
                .replace(" ", "")
                .toUpperCase(Locale.ROOT);
    }

    private String normalizeRequiredText(String value) {
        return value.trim();
    }

    private String normalizeOptionalText(String value) {
        if (!hasText(value)) {
            return null;
        }
        return value.trim();
    }

    private String normalizeOptionalUppercase(String value) {
        if (!hasText(value)) {
            return null;
        }
        return value.trim().toUpperCase(Locale.ROOT);
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
