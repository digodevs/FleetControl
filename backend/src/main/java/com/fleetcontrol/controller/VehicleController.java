package com.fleetcontrol.controller;

import com.fleetcontrol.dto.VehicleCreateRequest;
import com.fleetcontrol.dto.VehicleResponse;
import com.fleetcontrol.dto.VehicleUpdateRequest;
import com.fleetcontrol.entity.VehicleStatus;
import com.fleetcontrol.entity.VehicleType;
import com.fleetcontrol.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vehicles")
@SecurityRequirement(name = "bearerAuth")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @Operation(summary = "Criar veículo", description = "Somente ADMIN. Cria um veículo da frota com placa, RENAVAM e chassi únicos.")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.create(request));
    }

    @Operation(summary = "Listar veículos", description = "ADMIN e EMPLOYEE. Suporta paginação, ordenação, filtros por status/tipo e busca por placa, marca ou modelo.")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping
    public Page<VehicleResponse> list(
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) VehicleType type,
            @RequestParam(required = false) String search,
            @Parameter(hidden = true) @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return vehicleService.list(status, type, search, pageable);
    }

    @Operation(summary = "Buscar veículo por id", description = "ADMIN e EMPLOYEE.")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping("/{id}")
    public VehicleResponse findById(@PathVariable UUID id) {
        return vehicleService.findById(id);
    }

    @Operation(summary = "Atualizar veículo", description = "Somente ADMIN. A quilometragem não pode ser reduzida.")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public VehicleResponse update(@PathVariable UUID id, @Valid @RequestBody VehicleUpdateRequest request) {
        return vehicleService.update(id, request);
    }

    @Operation(summary = "Desativar veículo", description = "Somente ADMIN. Executa exclusão lógica definindo o status como INACTIVE.")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
