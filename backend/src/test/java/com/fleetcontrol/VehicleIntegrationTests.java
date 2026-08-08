package com.fleetcontrol;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
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
class VehicleIntegrationTests {

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
    void adminCanCreateValidVehicle() throws Exception {
        String adminToken = createUserAndGetAccessToken("admin-create@example.com");

        mockMvc.perform(post("/vehicles")
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(vehiclePayload("ABC-1D23", 1200L, "AVAILABLE"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.licensePlate").value("ABC1D23"))
                .andExpect(jsonPath("$.brand").value("Toyota"))
                .andExpect(jsonPath("$.status").value("AVAILABLE"));
    }

    @Test
    void duplicateLicensePlateIsRejected() throws Exception {
        String adminToken = createUserAndGetAccessToken("admin-duplicate@example.com");
        createVehicle(adminToken, "ABC1D23", 1200L, "AVAILABLE");

        mockMvc.perform(post("/vehicles")
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(vehiclePayload("ABC-1D23", 1400L, "AVAILABLE"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Placa ja esta cadastrada."));
    }

    @Test
    void findByIdReturnsVehicle() throws Exception {
        String adminToken = createUserAndGetAccessToken("admin-find@example.com");
        String id = createVehicle(adminToken, "FND1D23", 1200L, "AVAILABLE");

        mockMvc.perform(get("/vehicles/{id}", id)
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.licensePlate").value("FND1D23"));
    }

    @Test
    void missingVehicleReturnsNotFound() throws Exception {
        String adminToken = createUserAndGetAccessToken("admin-missing@example.com");

        mockMvc.perform(get("/vehicles/{id}", "11111111-1111-1111-1111-111111111111")
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Veiculo nao encontrado."));
    }

    @Test
    void adminCanUpdateVehicle() throws Exception {
        String adminToken = createUserAndGetAccessToken("admin-update@example.com");
        String id = createVehicle(adminToken, "UPD1D23", 1200L, "AVAILABLE");
        Map<String, Object> payload = vehiclePayload("UPD1D23", 2500L, "MAINTENANCE");
        payload.put("brand", "Honda");

        mockMvc.perform(put("/vehicles/{id}", id)
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand").value("Honda"))
                .andExpect(jsonPath("$.mileage").value(2500))
                .andExpect(jsonPath("$.status").value("MAINTENANCE"));
    }

    @Test
    void updateRejectsLowerMileage() throws Exception {
        String adminToken = createUserAndGetAccessToken("admin-mileage@example.com");
        String id = createVehicle(adminToken, "MIL1D23", 1200L, "AVAILABLE");

        mockMvc.perform(put("/vehicles/{id}", id)
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(vehiclePayload("MIL1D23", 100L, "AVAILABLE"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("A quilometragem nao pode ser menor que o valor atual."));
    }

    @Test
    void listSupportsPagination() throws Exception {
        String adminToken = createUserAndGetAccessToken("admin-list@example.com");
        createVehicle(adminToken, "LST1D23", 1200L, "AVAILABLE");
        createVehicle(adminToken, "LST2D23", 1300L, "MAINTENANCE");

        mockMvc.perform(get("/vehicles?page=0&size=1&sort=licensePlate,asc")
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    void listFiltersByStatus() throws Exception {
        String adminToken = createUserAndGetAccessToken("admin-filter@example.com");
        createVehicle(adminToken, "FLT1D23", 1200L, "AVAILABLE");
        createVehicle(adminToken, "FLT2D23", 1300L, "MAINTENANCE");

        mockMvc.perform(get("/vehicles?status=MAINTENANCE")
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].status").value("MAINTENANCE"));
    }

    @Test
    void employeeCannotCreateVehicle() throws Exception {
        createUserAndGetAccessToken("admin-for-employee@example.com");
        String employeeToken = createUserAndGetAccessToken("employee-create@example.com");

        mockMvc.perform(post("/vehicles")
                        .header(HttpHeaders.AUTHORIZATION, bearer(employeeToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(vehiclePayload("EMP1D23", 1200L, "AVAILABLE"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Acesso negado."));
    }

    @Test
    void requestWithoutJwtIsRejected() throws Exception {
        mockMvc.perform(get("/vehicles"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Autenticacao obrigatoria."));
    }

    @Test
    void deleteDeactivatesVehicle() throws Exception {
        String adminToken = createUserAndGetAccessToken("admin-delete@example.com");
        String id = createVehicle(adminToken, "DEL1D23", 1200L, "AVAILABLE");

        mockMvc.perform(delete("/vehicles/{id}", id)
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/vehicles/{id}", id)
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }

    private String createVehicle(String accessToken, String licensePlate, Long mileage, String status) throws Exception {
        String response = mockMvc.perform(post("/vehicles")
                        .header(HttpHeaders.AUTHORIZATION, bearer(accessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(vehiclePayload(licensePlate, mileage, status))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).get("id").asText();
    }

    private String createUserAndGetAccessToken(String email) throws Exception {
        String response = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "name", "Test User",
                                "email", email,
                                "password", "Password123!"
                        ))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode json = objectMapper.readTree(response);
        return json.get("accessToken").asText();
    }

    private Map<String, Object> vehiclePayload(String licensePlate, Long mileage, String status) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("licensePlate", licensePlate);
        payload.put("brand", "Toyota");
        payload.put("model", "Corolla");
        payload.put("year", 2024);
        payload.put("type", "CAR");
        payload.put("fuelType", "FLEX");
        payload.put("mileage", mileage);
        payload.put("status", status);
        payload.put("color", "White");
        payload.put("renavam", licensePlate.replace("-", "") + "REN");
        payload.put("chassis", licensePlate.replace("-", "") + "CHASSIS");
        return payload;
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private String json(Object body) throws Exception {
        return objectMapper.writeValueAsString(body);
    }
}
