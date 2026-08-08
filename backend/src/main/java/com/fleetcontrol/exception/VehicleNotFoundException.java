package com.fleetcontrol.exception;

import org.springframework.http.HttpStatus;

public class VehicleNotFoundException extends ApiException {

    public VehicleNotFoundException() {
        super(HttpStatus.NOT_FOUND, "Veiculo nao encontrado.");
    }
}
