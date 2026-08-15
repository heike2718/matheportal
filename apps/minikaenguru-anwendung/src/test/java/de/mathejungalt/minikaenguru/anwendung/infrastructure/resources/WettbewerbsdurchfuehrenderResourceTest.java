package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import java.util.List;
import java.util.Optional;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.ConstraintViolationDetail;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuehrenderRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkollegiumDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchulkollegiumsmitgliedEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.CleanupTestDataDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.MockAugmentSessionTestProfile;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
@TestHTTPEndpoint(WettbewerbsdurchfuehrenderResource.class)
@TestProfile(MockAugmentSessionTestProfile.class)
public class WettbewerbsdurchfuehrenderResourceTest {

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

        given().get().then().statusCode(404);
    }

    @Test
    @TestSecurity(user = UUID_PRIVATPERSON_READ)
    void should_return_200_when_known_privatperson() {

        final Wettbewerbsdurchfuehrender result = given()
                .accept(ContentType.JSON)
                .get()
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Wettbewerbsdurchfuehrender.class);

        // assert

        result.getTeilnahmenummern();

        assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, result.getDurchfuehrungsart()),
                () -> assertFalse(result.getNewsletter()),
                () -> assertEquals(ZugangsberechtigungUnterlagen.ERTEILT, result.getZugangsberechtigungUnterlagen()),
                () -> assertEquals(1, result.getTeilnahmenummern().size()),
                () -> assertEquals("12BOH1XSMH", result.getTeilnahmenummern().iterator().next()));
    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON_READ)
    void should_return_200_when_known_lehrperson() {

        final Wettbewerbsdurchfuehrender result = given()
                .accept(ContentType.JSON)
                .get()
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Wettbewerbsdurchfuehrender.class);

        // assert

        result.getTeilnahmenummern();

        assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.SCHULE, result.getDurchfuehrungsart()),
                () -> assertTrue(result.getNewsletter()),
                () -> assertEquals(ZugangsberechtigungUnterlagen.STANDARD, result.getZugangsberechtigungUnterlagen()),
                () -> assertEquals(2, result.getTeilnahmenummern().size()),
                () -> assertTrue(result.getTeilnahmenummern().contains("4T8VRTAA")),
                () -> assertTrue(result.getTeilnahmenummern().contains("5SMMXW54")));
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
                    .post()
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
                            result.getZugangsberechtigungUnterlagen()),
                    () -> assertEquals(1, result.getTeilnahmenummern().size()));

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
                    .post()
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
                    () -> assertEquals(1, result.getTeilnahmenummern().size()),
                    () -> assertEquals("6V5AHV38", result.getTeilnahmenummern().iterator().next()),
                    () -> assertEquals(1, result.getTeilnahmenummern().size()), () -> opt.isPresent());

        } finally {
            this.cleanupDao.deleteWettbewerbsdurchfuehrendeByUserUuid(UUID_MP_TEST_TO_LEHRPERSON);
            this.cleanupDao.deleteSchulkollegiumMitglied(UUID_MP_TEST_TO_LEHRPERSON);
        }
    }

    @Test
    @TestSecurity(user = UUID_MP_TEST_TO_LEHRPERSON)
    void should_return_400_when_schulkuerzel_invaid() {

        final WettbewerbsdurchfuehrenderRequest requestPayload = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.SCHULE)
                .schulkuerzel("äöü456789");

        final ErrorResponse result = given()
                .accept(ContentType.JSON)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .post()
                .then()
                .statusCode(400)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(ErrorResponse.class);

        // assert
        final List<ConstraintViolationDetail> details = result.getConstraintViolations();

        final Optional<ConstraintViolationDetail> optSize = details
                .stream()
                .filter(cv -> "Größe muss zwischen 0 und 8 sein".equals(cv.getMessage()))
                .findFirst();

        final Optional<ConstraintViolationDetail> optPattern = details
                .stream()
                .filter(cv -> "muss mit \"^[A-Z0-9]*$\" übereinstimmen".equals(cv.getMessage()))
                .findFirst();

        final Optional<ConstraintViolationDetail> optCross = details
                .stream()
                .filter(cv -> "wettbewerbsdurchfuehrenderRequest".equals(cv.getField()))
                .findFirst();

        assertAll(() -> assertEquals("Die Anfrage ist nicht valide.", result.getMessage()),
                () -> assertEquals(3, details.size()), () -> assertTrue(optSize.isPresent()),
                () -> assertTrue(optPattern.isPresent()), () -> assertTrue(optCross.isPresent()),
                () -> assertEquals("schulkuerzel", optSize.get().getField()),
                () -> assertEquals("schulkuerzel", optPattern.get().getField()),
                () -> assertEquals("schulkuerzel äöü456789 existiert nicht", optCross.get().getMessage()));
    }
}
