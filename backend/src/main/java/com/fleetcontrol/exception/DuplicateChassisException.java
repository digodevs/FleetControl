package com.fleetcontrol.exception;

import org.springframework.http.HttpStatus;

public class DuplicateChassisException extends ApiException {

    public DuplicateChassisException() {
        super(HttpStatus.CONFLICT, "Chassi já está cadastrado.");
    }
}
