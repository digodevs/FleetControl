package com.fleetcontrol.service;

import com.fleetcontrol.entity.RefreshToken;
import com.fleetcontrol.entity.User;
import com.fleetcontrol.exception.InvalidTokenException;
import com.fleetcontrol.repository.RefreshTokenRepository;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 64;

    private final RefreshTokenRepository refreshTokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    private final long refreshTokenExpirationMillis;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${app.jwt.refresh-expiration-millis}") long refreshTokenExpirationMillis
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenExpirationMillis = refreshTokenExpirationMillis;
    }

    @Transactional
    public RefreshToken create(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(generateToken());
        refreshToken.setExpiresAt(OffsetDateTime.now().plusNanos(refreshTokenExpirationMillis * 1_000_000));
        refreshToken.setRevoked(false);
        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional(readOnly = true)
    public RefreshToken validate(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token."));

        if (refreshToken.isRevoked()) {
            throw new InvalidTokenException("O refresh token foi revogado.");
        }

        if (refreshToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new InvalidTokenException("O refresh token expirou.");
        }

        if (!refreshToken.getUser().isEnabled()) {
            throw new InvalidTokenException("A conta do usuário está desativada.");
        }

        return refreshToken;
    }

    @Transactional
    public void revoke(String token) {
        RefreshToken refreshToken = validate(token);
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }

    private String generateToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
