package com.fleetcontrol.exception;

import org.springframework.http.HttpStatus;

public class InvalidMileageException extends ApiException {

    public InvalidMileageException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}

