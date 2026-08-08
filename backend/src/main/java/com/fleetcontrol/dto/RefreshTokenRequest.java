package com.fleetcontrol.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "O refresh token e obrigatorio.")
        String refreshToken
) {
}
