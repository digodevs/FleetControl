package com.fleetcontrol.service;

import com.fleetcontrol.dto.AuthResponse;
import com.fleetcontrol.dto.LoginRequest;
import com.fleetcontrol.dto.RegisterRequest;
import com.fleetcontrol.dto.UserResponse;
import com.fleetcontrol.entity.RefreshToken;
import com.fleetcontrol.entity.Role;
import com.fleetcontrol.entity.RoleName;
import com.fleetcontrol.entity.User;
import com.fleetcontrol.exception.DisabledUserException;
import com.fleetcontrol.exception.EmailAlreadyRegisteredException;
import com.fleetcontrol.exception.InvalidCredentialsException;
import com.fleetcontrol.exception.InvalidTokenException;
import com.fleetcontrol.mapper.UserMapper;
import com.fleetcontrol.repository.RoleRepository;
import com.fleetcontrol.repository.UserRepository;
import com.fleetcontrol.security.AuthenticatedUser;
import com.fleetcontrol.security.JwtService;
import java.util.Set;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserMapper userMapper;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.userMapper = userMapper;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyRegisteredException();
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEnabled(true);
        user.setRoles(Set.of(resolveRegistrationRole()));

        User savedUser = userRepository.save(user);
        return issueTokens(savedUser);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.email()))
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.isEnabled()) {
            throw new DisabledUserException();
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(String token) {
        RefreshToken refreshToken = refreshTokenService.validate(token);
        return issueTokens(refreshToken.getUser());
    }

    @Transactional
    public void logout(String token) {
        refreshTokenService.revoke(token);
    }

    @Transactional(readOnly = true)
    public UserResponse me(AuthenticatedUser authenticatedUser) {
        User user = userRepository.findByEmail(authenticatedUser.getUsername())
                .orElseThrow(() -> new InvalidTokenException("Authenticated user no longer exists."));
        return userMapper.toResponse(user);
    }

    private AuthResponse issueTokens(User user) {
        AuthenticatedUser authenticatedUser = new AuthenticatedUser(user);
        RefreshToken refreshToken = refreshTokenService.create(user);

        return new AuthResponse(
                jwtService.generateAccessToken(authenticatedUser),
                refreshToken.getToken(),
                "Bearer",
                jwtService.getAccessTokenExpirationMillis() / 1000,
                userMapper.toResponse(user)
        );
    }

    private Role resolveRegistrationRole() {
        RoleName roleName = userRepository.count() == 0 ? RoleName.ADMIN : RoleName.EMPLOYEE;
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Required role was not seeded: " + roleName));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}

