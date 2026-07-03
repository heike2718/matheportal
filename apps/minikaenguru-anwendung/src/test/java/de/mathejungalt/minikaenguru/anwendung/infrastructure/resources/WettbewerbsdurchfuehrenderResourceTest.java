package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuerenderRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.CleanupTestDataDao;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
@TestHTTPEndpoint(WettbewerbsdurchfuehrenderResource.class)
public class WettbewerbsdurchfuehrenderResourceTest {

    @Inject
    CleanupTestDataDao cleanupDao;

    private static final String UUID_LEHRPERSON_READ = "5a35eb31-4edb-452b-9f37-980e52885677";
    private static final String UUID_PRIVATPERSON_READ = "5af5219c-6c56-49dc-ae66-e90134ed1091";
    private static final String UUID_MP_TEST_TO_PRIVATPERSON = "afef5283-ecf8-4ba5-97fc-3cd4a0ea4e97";
    // private static final String UUID_MP_TEST_TO_LEHRPERSON =
    // "c221245f-98a9-49fd-acbd-f4a6340f8338";

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

            final WettbewerbsdurchfuerenderRequest requestPayload = new WettbewerbsdurchfuerenderRequest()
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
            this.cleanupDao.deleteWettbewerbsdurchfuehrendeByUserUuidQuietly(UUID_MP_TEST_TO_PRIVATPERSON);
        }

    }
}
