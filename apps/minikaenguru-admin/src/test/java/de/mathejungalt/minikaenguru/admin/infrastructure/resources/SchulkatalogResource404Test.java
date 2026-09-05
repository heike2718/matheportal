package de.mathejungalt.minikaenguru.admin.infrastructure.resources;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.admin.domain.generated.ErrorResponse;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleWithOrtRequest;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestHTTPEndpoint(SchulkatalogResource.class)
public class SchulkatalogResource404Test {

    @Test
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_schuleInOrtAnlegen_return_404_when_ort_not_found() {

        final String kuerzelOrt = "ZZZZZZZZ";

        final SchuleRequest schuleRequest = new SchuleRequest()
                .emailAuftraggeber("mail@provider.de")
                .name("Kleinfeldchenschule");

        final ErrorResponse result = given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .post("/orte/" + kuerzelOrt + "/schulen")
                .then()
                .statusCode(404)
                .and()
                .extract()
                .as(ErrorResponse.class);

        assertEquals("Die Ressource gibt es nicht oder nicht mehr.", result.getMessage());

    }

    @Test
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_schuleInLandAnlegen_return_404_when_land_not_found() {

        final String kuerzelLand = "ZZZZZ";

        final SchuleWithOrtRequest schuleRequest = new SchuleWithOrtRequest()
                .emailAuftraggeber("mail@provider.de")
                .nameSchule("Goetheschule")
                .nameOrt("Bar");

        final ErrorResponse result = given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .post("/laender/" + kuerzelLand + "/schulen")
                .then()
                .statusCode(404)
                .and()
                .extract()
                .as(ErrorResponse.class);

        assertEquals("Die Ressource gibt es nicht oder nicht mehr.", result.getMessage());

    }

    @Test
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_schuleUmbenennen_return_404_when_not_found() {
        final String kuerzel = "ZZZZZZZZ";

        final SchuleRequest schuleRequest = new SchuleRequest()
                .emailAuftraggeber("mail@provider.de")
                .name("Heineschule");

        final ErrorResponse result = given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .put("/schulen/" + kuerzel)
                .then()
                .statusCode(404)
                .and()
                .extract()
                .as(ErrorResponse.class);

        assertEquals("Die Ressource gibt es nicht oder nicht mehr.", result.getMessage());

    }

}
