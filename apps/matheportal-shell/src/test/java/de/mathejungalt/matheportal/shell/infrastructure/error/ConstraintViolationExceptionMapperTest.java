package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

import static io.restassured.RestAssured.given;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
class ConstraintViolationExceptionMapperTest {

    /**
     * Ein minimalistischer Test-Endpunkt im Test-Scope, um eine echte ConstraintViolationException auszulösen.
     */
    @Path("/test-validation")
    public static class TestResource {

        @POST
        @Produces(MediaType.APPLICATION_JSON)
        public void testMethod(@NotNull @Size(min = 3) final String payload) {
            // Wird für den Validierungsfehler nicht erreicht
        }
    }

    @Test
    void testToResponse_ShouldReturnBadRequestWithErrorResponse() {
        // Eine leere Payload triggert die @NotNull-Validierung der TestResource
        given()
                .contentType(MediaType.APPLICATION_JSON)
                .body("")
                .when()
                .post("/test-validation")
                .then()
                .statusCode(400) // Status.BAD_REQUEST
                .body("message", equalTo("Die Anfrage ist nicht valide"))
                .body("connstraintViolations", notNullValue())
                .body("connstraintViolations[0].field", equalTo("payload"))
                .body("connstraintViolations[0].message", notNullValue());
    }
}
