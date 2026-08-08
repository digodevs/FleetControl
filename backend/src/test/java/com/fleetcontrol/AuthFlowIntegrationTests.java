package com.fleetcontrol;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fleetcontrol.entity.User;
import com.fleetcontrol.repository.RefreshTokenRepository;
import com.fleetcontrol.repository.UserRepository;
import com.fleetcontrol.security.CustomUserDetailsService;
import com.fleetcontrol.security.JwtService;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@SpringBootTest
class AuthFlowIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @BeforeEach
    void cleanDatabase() {
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void registerCreatesAdminUserAndStoresBCryptPassword() throws Exception {
        String response = register("Owner", "owner@example.com", "Password123!");

        JsonNode json = objectMapper.readTree(response);
        assertThat(json.get("accessToken").asText()).isNotBlank();
        assertThat(json.get("refreshToken").asText()).isNotBlank();
        assertThat(json.at("/user/roles").toString()).contains("ADMIN");
        assertThat(json.at("/user/password").isMissingNode()).isTrue();

        User savedUser = userRepository.findByEmail("owner@example.com").orElseThrow();
        assertThat(savedUser.getPassword()).isNotEqualTo("Password123!");
        assertThat(passwordEncoder.matches("Password123!", savedUser.getPassword())).isTrue();
    }

    @Test
    void loginReturnsTokensForValidCredentials() throws Exception {
        register("Owner", "login@example.com", "Password123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "email", "login@example.com",
                                "password", "Password123!"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    void loginRejectsInvalidCredentials() throws Exception {
        register("Owner", "invalid-login@example.com", "Password123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "email", "invalid-login@example.com",
                                "password", "wrong-password"
                        ))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("E-mail ou senha invalidos."));
    }

    @Test
    void jwtGenerationAndValidationWorks() throws Exception {
        register("Owner", "jwt@example.com", "Password123!");
        var userDetails = userDetailsService.loadUserByUsername("jwt@example.com");

        String token = jwtService.generateAccessToken(userDetails);

        assertThat(jwtService.extractUsername(token)).isEqualTo("jwt@example.com");
        assertThat(jwtService.isTokenValid(token, userDetails)).isTrue();
    }

    @Test
    void protectedRouteRequiresToken() throws Exception {
        mockMvc.perform(get("/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Autenticacao obrigatoria."));
    }

    @Test
    void protectedRouteAcceptsValidToken() throws Exception {
        String response = register("Owner", "me@example.com", "Password123!");
        String accessToken = objectMapper.readTree(response).get("accessToken").asText();

        mockMvc.perform(get("/auth/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("me@example.com"))
                .andExpect(jsonPath("$.roles[0]").value("ADMIN"));
    }

    @Test
    void refreshAndLogoutWorkWithPersistedRefreshToken() throws Exception {
        String response = register("Owner", "refresh@example.com", "Password123!");
        JsonNode auth = objectMapper.readTree(response);
        String accessToken = auth.get("accessToken").asText();
        String refreshToken = auth.get("refreshToken").asText();

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("refreshToken", refreshToken))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty());

        mockMvc.perform(post("/auth/logout")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("refreshToken", refreshToken))))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("refreshToken", refreshToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("O refresh token foi revogado."));
    }

    private String register(String name, String email, String password) throws Exception {
        return mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "name", name,
                                "email", email,
                                "password", password
                        ))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
    }

    private String json(Object body) throws Exception {
        return objectMapper.writeValueAsString(body);
    }
}
