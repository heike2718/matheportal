package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import java.util.Arrays;
import java.util.Optional;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuehrenderRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkollegiumDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchulkollegiumsmitgliedEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.CleanupTestDataDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.MockAugmentSessionTestProfile;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.TestConstants;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
@TestHTTPEndpoint(WettbewerbsdurchfuehrendeResource.class)
@TestProfile(MockAugmentSessionTestProfile.class)
public class WettbewerbsdurchfuehrendeResourceTest {

    @Inject
    CleanupTestDataDao cleanupDao;

    @Inject
    SchulkollegiumDao schulkollegiumDao;

    private static final String UUID_LEHRPERSON_READ = "5a35eb31-4edb-452b-9f37-980e52885677";
    private static final String UUID_PRIVATPERSON_READ = "5af5219c-6c56-49dc-ae66-e90134ed1091";
    private static final String UUID_MP_TEST_TO_PRIVATPERSON = "afef5283-ecf8-4ba5-97fc-3cd4a0ea4e97";
    private static final String UUID_MP_TEST_TO_LEHRPERSON = "c221245f-98a9-49fd-acbd-f4a6340f8338";
    private static final String KUERZEL_GRUNDSCHULE_WIPPRA = "6V5AHV38";

    @Test
    @TestSecurity(user = "nicht-existent")
    void should_return_404_when_unknown() {

        given().get("/konto").then().statusCode(404);
    }

    @Test
    @TestSecurity(user = UUID_PRIVATPERSON_READ)
    void should_return_200_when_known_privatperson() {

        final Wettbewerbsdurchfuehrender result = given()
                .accept(ContentType.JSON)
                .get("/konto")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Wettbewerbsdurchfuehrender.class);

        // assert
        assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, result.getDurchfuehrungsart()),
                () -> assertFalse(result.getNewsletter()),
                () -> assertEquals(ZugangsberechtigungUnterlagen.ERTEILT, result.getZugangsberechtigungUnterlagen()));
    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON_READ)
    void should_return_200_when_known_lehrperson() {

        final Wettbewerbsdurchfuehrender result = given()
                .accept(ContentType.JSON)
                .get("/konto")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Wettbewerbsdurchfuehrender.class);

        // assert
        assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.SCHULE, result.getDurchfuehrungsart()),
                () -> assertTrue(result.getNewsletter()),
                () -> assertEquals(ZugangsberechtigungUnterlagen.STANDARD, result.getZugangsberechtigungUnterlagen()));
    }

    @Test
    @TestSecurity(user = UUID_MP_TEST_TO_PRIVATPERSON)
    void should_create_privatperson() {

        try {

            final WettbewerbsdurchfuehrenderRequest requestPayload = new WettbewerbsdurchfuehrenderRequest()
                    .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.PRIVAT);

            final Wettbewerbsdurchfuehrender result = given()
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(requestPayload)
                    .post("/konto")
                    .then()
                    .statusCode(201)
                    .and()
                    .assertThat()
                    .contentType(ContentType.JSON)
                    .and()
                    .extract()
                    .as(Wettbewerbsdurchfuehrender.class);

            assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, result.getDurchfuehrungsart()),
                    () -> assertFalse(result.getNewsletter()),
                    () -> assertEquals(ZugangsberechtigungUnterlagen.STANDARD,
                            result.getZugangsberechtigungUnterlagen()));

        } finally {
            this.cleanupDao.deleteWettbewerbsdurchfuehrendeByUserUuid(UUID_MP_TEST_TO_PRIVATPERSON);
        }
    }

    @Test
    @TestSecurity(user = UUID_MP_TEST_TO_LEHRPERSON)
    void should_create_lehrperson() {

        try {

            final WettbewerbsdurchfuehrenderRequest requestPayload = new WettbewerbsdurchfuehrenderRequest()
                    .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.SCHULE)
                    .schulkuerzel(KUERZEL_GRUNDSCHULE_WIPPRA);

            final Wettbewerbsdurchfuehrender result = given()
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(requestPayload)
                    .post("/konto")
                    .then()
                    .statusCode(201)
                    .and()
                    .assertThat()
                    .contentType(ContentType.JSON)
                    .and()
                    .extract()
                    .as(Wettbewerbsdurchfuehrender.class);

            // assert
            final Optional<SchulkollegiumsmitgliedEntity> opt = schulkollegiumDao
                    .findForUserAndSchule(UUID_MP_TEST_TO_LEHRPERSON, KUERZEL_GRUNDSCHULE_WIPPRA);

            assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.SCHULE, result.getDurchfuehrungsart()),
                    () -> assertFalse(result.getNewsletter()),
                    () -> assertEquals(ZugangsberechtigungUnterlagen.STANDARD,
                            result.getZugangsberechtigungUnterlagen()),
                    () -> opt.isPresent());

        } finally {
            this.cleanupDao.deleteWettbewerbsdurchfuehrendeByUserUuid(UUID_MP_TEST_TO_LEHRPERSON);
            this.cleanupDao.deleteSchulkollegiumMitglied(UUID_MP_TEST_TO_LEHRPERSON);
        }
    }

    @Test
    @TestSecurity(user = UUID_MP_TEST_TO_LEHRPERSON)
    void should_return_400_when_schulkuerzel_invaid() {

        // arrange
        final WettbewerbsdurchfuehrenderRequest requestPayload = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.SCHULE)
                .schulkuerzel("äöü456789");

        final ErrorResponse result = given()
                .accept(ContentType.JSON)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .post("/konto")
                .then()
                .statusCode(400)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(ErrorResponse.class);

        // assert
        assertEquals(TestConstants.EXPECTED_BAD_REQUEST_MESSAGE, result.getMessage());

    }

    @Test
    @TestSecurity(user = "412b67dc-132f-465a-a3c3-468269e866cb")
    void should_loadMySchools_work() {

        final Schule[] schulen = given()
                .accept(ContentType.JSON)
                .get("/me/schulen")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Schule[].class);

        assertEquals(10, schulen.length);
        {
            final Optional<Schule> optSchule = Arrays
                    .stream(schulen)
                    .filter(schule -> "0LDKMW8U".equals(schule.getKuerzel()))
                    .findFirst();

            assertTrue(optSchule.isPresent());
            final Schule schule = optSchule.get();
            assertAll(() -> assertNotNull(schule.getOrt()), () -> assertNotNull(schule.getOrt().getLand()));
        }
        {
            final Optional<Schule> optSchule = Arrays
                    .stream(schulen)
                    .filter(schule -> "G1HDI46O".equals(schule.getKuerzel()))
                    .findFirst();

            assertTrue(optSchule.isPresent());
            final Schule schule = optSchule.get();
            assertAll(() -> assertNotNull(schule.getOrt()), () -> assertNotNull(schule.getOrt().getLand()));
        }

    }

    @Test
    void should_loadMySchools_reurn_401_when_not_logged_in() {

        given().accept(ContentType.JSON).get("/me/schulen").then().statusCode(401);
    }

    @Test
    @TestSecurity(user = "abcdef")
    void should_loadMySchools_reurn_403_when_kein_wettbwerbsdurchfuehrender() {

        given().accept(ContentType.JSON).get("/me/schulen").then().statusCode(403);
    }

    @Test
    @TestSecurity(user = UUID_PRIVATPERSON_READ)
    void should_loadMySchools_reurn_403_when_privatperson() {

        given().accept(ContentType.JSON).get("/me/schulen").then().statusCode(403);
    }

}
