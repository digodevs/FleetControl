package com.fleetcontrol.exception;

import org.springframework.http.HttpStatus;

public class DuplicateLicensePlateException extends ApiException {

    public DuplicateLicensePlateException() {
        super(HttpStatus.CONFLICT, "License plate is already registered.");
    }
}

