package de.mathejungalt.minikaenguru.admin.infrastructure.resources;

import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.admin.domain.generated.LandMitOrtUndSchuleAnlegenRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.OrtMitSchuleAnlegenRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleAnlegenOderAendernRequest;

import io.restassured.http.ContentType;
import io.restassured.http.Method;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.params.provider.Arguments.arguments;

@QuarkusTest
@TestHTTPEndpoint(SchulkatalogResource.class)
public class SchulkatalogResourceSecurityTest {

    static Stream<Arguments> endpoints() {
        return Stream
                .of(arguments("GET", "/laender"), arguments("GET", "laender/DE-TH/orte"),
                        arguments("GET", "/orte/46AL373N/schulen"));
    }

    @ParameterizedTest(name = "[{index}] {0} {1} -> 401 Anonym")
    @MethodSource("endpoints")
    void should_return_401_when_not_authenticaded(final Method method, final String path) {
        given().when().request(method, path).then().statusCode(401);
    }

    @ParameterizedTest(name = "[{index}] {0} {1} -> 403 Falsche Rolle")
    @MethodSource("endpoints")
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_return_403_when_not_admin(final Method method, final String path) {
        given().when().request(method, path).then().statusCode(403);
    }

    @Test
    void should_schuleAnlegen_return_401_when_not_authenticated() {

        final LandMitOrtUndSchuleAnlegenRequest schuleRequest = new LandMitOrtUndSchuleAnlegenRequest()
                .emailAuftraggeber("mail@provider.de")
                .kuerzelLand("DE-TH")
                .nameLand("Thüringen")
                .nameOrt("Spa")
                .nameSchule("Pinocciogrundschule");

        given().body(schuleRequest).contentType(ContentType.JSON).when().post("/schulen").then().statusCode(401);
    }

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_schuleAnlegen_return_403_when_not_admin() {

        final LandMitOrtUndSchuleAnlegenRequest schuleRequest = new LandMitOrtUndSchuleAnlegenRequest()
                .emailAuftraggeber("mail@provider.de")
                .kuerzelLand("DE-TH")
                .nameLand("Thüringen")
                .nameOrt("Spa")
                .nameSchule("Pinocciogrundschule");

        given().body(schuleRequest).contentType(ContentType.JSON).when().post("/schulen").then().statusCode(403);
    }

    @Test
    void should_schuleInLandAnlegen_return_401_when_not_authenticated() {

        final OrtMitSchuleAnlegenRequest schuleRequest = new OrtMitSchuleAnlegenRequest()
                .emailAuftraggeber("mail@provider.de")
                .nameOrt("Spa")
                .nameSchule("Pinocciogrundschule");

        given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .post("/laender/DE-SN/schulen")
                .then()
                .statusCode(401);
    }

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_schuleInLandAnlegen_return_403_when_not_admin() {

        final OrtMitSchuleAnlegenRequest schuleRequest = new OrtMitSchuleAnlegenRequest()
                .emailAuftraggeber("mail@provider.de")
                .nameOrt("Spa")
                .nameSchule("Pinocciogrundschule");

        given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .post("/laender/DE-SN/schulen")
                .then()
                .statusCode(403);
    }

    @Test
    void should_schuleInOrtAnlegen_return_401_when_not_authenticated() {

        final SchuleAnlegenOderAendernRequest schuleRequest = new SchuleAnlegenOderAendernRequest()
                .emailAuftraggeber("mail@provider.de")
                .name("Pinocciogrundschule");

        given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .post("/orte/A1234567/schulen")
                .then()
                .statusCode(401);
    }

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_schuleInOrtAnlegen_return_403_when_not_admin() {

        final SchuleAnlegenOderAendernRequest schuleRequest = new SchuleAnlegenOderAendernRequest()
                .emailAuftraggeber("mail@provider.de")
                .name("Pinocciogrundschule");

        given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .post("/orte/A1234567/schulen")
                .then()
                .statusCode(403);
    }

    @Test
    void should_schuleUmbenennen_return_401_when_not_authenticated() {

        final SchuleAnlegenOderAendernRequest schuleRequest = new SchuleAnlegenOderAendernRequest()
                .emailAuftraggeber("mail@provider.de")
                .name("Pinocciogrundschule");

        given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .put("/schulen/A1234567")
                .then()
                .statusCode(401);
    }

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_schuleUmbenennen_return_403_when_not_admin() {

        final SchuleAnlegenOderAendernRequest schuleRequest = new SchuleAnlegenOderAendernRequest()
                .emailAuftraggeber("mail@provider.de")
                .name("Pinocciogrundschule");

        given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .put("/schulen/A1234567")
                .then()
                .statusCode(403);
    }
}
