package com.fleetcontrol;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fleetcontrol.repository.RefreshTokenRepository;
import com.fleetcontrol.repository.UserRepository;
import com.fleetcontrol.repository.VehicleRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@SpringBootTest
class DashboardIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDatabase() {
        vehicleRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void dashboardRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/dashboard"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Authentication is required."));
    }

    @Test
    void dashboardReturnsAggregatedVehicleData() throws Exception {
        String token = registerAndGetAccessToken("dashboard-admin@example.com");
        createVehicle(token, "DSH1D23", "CAR", "AVAILABLE");
        createVehicle(token, "DSH2D23", "TRUCK", "MAINTENANCE");
        createVehicle(token, "DSH3D23", "VAN", "IN_USE");

        mockMvc.perform(get("/dashboard").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalVehicles").value(3))
                .andExpect(jsonPath("$.availableVehicles").value(1))
                .andExpect(jsonPath("$.inUseVehicles").value(1))
                .andExpect(jsonPath("$.maintenanceVehicles").value(1))
                .andExpect(jsonPath("$.inactiveVehicles").value(0))
                .andExpect(jsonPath("$.vehiclesCreatedThisMonth").value(3))
                .andExpect(jsonPath("$.vehiclesByType.length()").value(6))
                .andExpect(jsonPath("$.vehiclesByStatus.length()").value(4))
                .andExpect(jsonPath("$.vehicleRegistrationsByMonth.length()").value(6));
    }

    private void createVehicle(String token, String licensePlate, String type, String status) throws Exception {
        mockMvc.perform(post("/vehicles")
                        .header(HttpHeaders.AUTHORIZATION, bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(vehiclePayload(licensePlate, type, status))))
                .andExpect(status().isCreated());
    }

    private String registerAndGetAccessToken(String email) throws Exception {
        String response = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "name", "Dashboard Admin",
                                "email", email,
                                "password", "Password123!"
                        ))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).get("accessToken").asText();
    }

    private Map<String, Object> vehiclePayload(String licensePlate, String type, String status) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("licensePlate", licensePlate);
        payload.put("brand", "Toyota");
        payload.put("model", "Corolla");
        payload.put("year", 2024);
        payload.put("type", type);
        payload.put("fuelType", "FLEX");
        payload.put("mileage", 1200);
        payload.put("status", status);
        payload.put("color", "White");
        payload.put("renavam", licensePlate + "REN");
        payload.put("chassis", licensePlate + "CHASSIS");
        return payload;
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private String json(Object body) throws Exception {
        return objectMapper.writeValueAsString(body);
    }
}

