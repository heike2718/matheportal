package de.mathejungalt.minikaenguru.admin.infrastructure.resources;

import java.util.ArrayList;
import java.util.List;

import jakarta.inject.Inject;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleWithLandAndOrtRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleWithOrtRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchulkuerzelDto;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.dao.SchulkatalogDao;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleEntity;
import de.mathejungalt.minikaenguru.admin.test.CleanupTestDataDao;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

@QuarkusTest
@TestHTTPEndpoint(SchulkatalogResource.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SchulkatalogResourceAnlegenUndAendernTest {

    private static final String KUERZEL_LAND = "DE-ZZ";
    private final static List<String> SCHULKUERZEL = new ArrayList<>();

    @Inject
    SchulkatalogDao schulkatalogDao;

    @Inject
    CleanupTestDataDao cleanupDao;

    @AfterEach
    void cleanup() {
        if (SCHULKUERZEL.size() == 3) {
            cleanupDao.deleteLand(KUERZEL_LAND);
        }
    }

    @Test
    @Order(1)
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_schuleAnlegen_work() {

        final SchuleWithLandAndOrtRequest schuleRequest = new SchuleWithLandAndOrtRequest()
                .emailAuftraggeber("mail@provider.de")
                .kuerzelLand(KUERZEL_LAND)
                .nameLand("Land-Z")
                .nameOrt("Testort")
                .nameSchule("Pinoccioschule");

        final SchulkuerzelDto result = given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .post("/schulen")
                .then()
                .statusCode(201)
                .and()
                .extract()
                .as(SchulkuerzelDto.class);

        assertEquals(8, result.getKuerzel().length());

        final SchuleEntity schule = schulkatalogDao.findSchuleById(result.getKuerzel());
        assertEquals("Pinoccioschule", schule.getName());

        SCHULKUERZEL.add(result.getKuerzel());
    }

    @Test
    @Order(2)
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_schuleUmbenennen_work() {

        final String kuerzel = SCHULKUERZEL.get(0);

        final SchuleRequest schuleRequest = new SchuleRequest()
                .emailAuftraggeber("mail@provider.de")
                .name("Baumschule");

        final SchulkuerzelDto result = given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .put("/schulen/" + kuerzel)
                .then()
                .statusCode(200)
                .and()
                .extract()
                .as(SchulkuerzelDto.class);

        assertEquals(kuerzel, result.getKuerzel());

        final SchuleEntity schule = schulkatalogDao.findSchuleById(result.getKuerzel());
        assertEquals("Baumschule", schule.getName());
    }

    @Test
    @Order(3)
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_schuleInOrtAnlegen_work() {

        final String kuerzel = SCHULKUERZEL.get(0);
        final SchuleEntity schule = schulkatalogDao.findSchuleById(kuerzel);

        if (schule == null) {
            fail("erste schule wurde nicht angelegt");
        }

        final String kuerzelOrt = schule.getKuerzelOrt();

        final SchuleRequest schuleRequest = new SchuleRequest()
                .emailAuftraggeber("mail@provider.de")
                .name("Kleinfeldchenschule");

        final SchulkuerzelDto result = given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .post("/orte/" + kuerzelOrt + "/schulen")
                .then()
                .statusCode(201)
                .and()
                .extract()
                .as(SchulkuerzelDto.class);

        assertEquals(8, result.getKuerzel().length());

        final SchuleEntity schuleEntity = schulkatalogDao.findSchuleById(result.getKuerzel());
        assertEquals("Kleinfeldchenschule", schuleEntity.getName());

        SCHULKUERZEL.add(result.getKuerzel());
    }

    @Test
    @Order(4)
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_schuleInLandAnlegen_work() {

        final SchuleWithOrtRequest schuleRequest = new SchuleWithOrtRequest()
                .emailAuftraggeber("mail@provider.de")
                .nameSchule("Goetheschule")
                .nameOrt("Bar");

        final SchulkuerzelDto result = given()
                .body(schuleRequest)
                .contentType(ContentType.JSON)
                .when()
                .post("/laender/" + KUERZEL_LAND + "/schulen")
                .then()
                .statusCode(201)
                .and()
                .extract()
                .as(SchulkuerzelDto.class);

        assertEquals(8, result.getKuerzel().length());

        final SchuleEntity schuleEntity = schulkatalogDao.findSchuleById(result.getKuerzel());
        assertEquals("Goetheschule", schuleEntity.getName());

        SCHULKUERZEL.add(result.getKuerzel());
    }

}
