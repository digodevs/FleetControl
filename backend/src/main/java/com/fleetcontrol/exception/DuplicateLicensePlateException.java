package com.fleetcontrol.exception;

import org.springframework.http.HttpStatus;

public class DuplicateLicensePlateException extends ApiException {

    public DuplicateLicensePlateException() {
        super(HttpStatus.CONFLICT, "Placa ja esta cadastrada.");
    }
}
