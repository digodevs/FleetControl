package com.fleetcontrol.exception;

import org.springframework.http.HttpStatus;

public class DuplicateRenavamException extends ApiException {

    public DuplicateRenavamException() {
        super(HttpStatus.CONFLICT, "RENAVAM is already registered.");
    }
}

