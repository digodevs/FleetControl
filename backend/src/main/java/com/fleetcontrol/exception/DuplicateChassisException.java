package com.fleetcontrol.exception;

import org.springframework.http.HttpStatus;

public class DuplicateChassisException extends ApiException {

    public DuplicateChassisException() {
        super(HttpStatus.CONFLICT, "Chassis is already registered.");
    }
}

