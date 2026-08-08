package com.fleetcontrol.exception;

import org.springframework.http.HttpStatus;

public class DisabledUserException extends ApiException {

    public DisabledUserException() {
        super(HttpStatus.FORBIDDEN, "A conta do usuário está desativada.");
    }
}
