package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import java.util.List;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Anmeldestatus;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Auswertungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.PrivatpersonWettbewerbskontext;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Teilnahme;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.CleanupTestDataDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.MockAugmentSessionTestProfile;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@QuarkusTest
@TestHTTPEndpoint(PrivatpersonResource.class)
@TestProfile(MockAugmentSessionTestProfile.class)
public class PrivatpersonResourceTest {

    private static final String UUID_LEHRPERSON_READ = "5a35eb31-4edb-452b-9f37-980e52885677";
    private static final String UUID_PRIVATPERSON_READ = "5af5219c-6c56-49dc-ae66-e90134ed1091";

    private static final String UUID_LEO_LEMMA = "13654c66-970c-40b8-8564-8173a18d41d0";
    private static final String KUERZEL_LEO_LEMMA = "GJT2M9E25K";

    @Inject
    WettbewerbService wettbewerbService;

    @Inject
    CleanupTestDataDao cleanupDao;

    @Test
    @TestSecurity(user = UUID_PRIVATPERSON_READ)
    void should_loadMyWettbewerbskontext_work() {

        final PrivatpersonWettbewerbskontext result = given()
                .accept(ContentType.JSON)
                .get("/wettbewerbskontext")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(PrivatpersonWettbewerbskontext.class);

        assertEquals(Anmeldestatus.MOEGLICH, result.getAnmeldestatus());
        final List<TeilnahmeReferenz> teilnahmeRefs = result.getTeilnahmerefs();
        assertEquals(1, teilnahmeRefs.size());
        final TeilnahmeReferenz teilnahmeRef = teilnahmeRefs.getFirst();
        assertEquals(2017, teilnahmeRef.getJahr());
    }

    @Test
    void should_loadMyWettbewerbskontext_return_401_when_not_loggedIn() {

        given().accept(ContentType.JSON).get("/wettbewerbskontext").then().statusCode(401);
    }

    @Test
    @TestSecurity(user = "abcdef")
    void should_loadMyWettbewerbskontext_return_403_when_kein_wettbewerbsdurchfuehrender() {
        given().accept(ContentType.JSON).get("/wettbewerbskontext").then().statusCode(403);
    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON_READ)
    void should_loadMyWettbewerbskontext_return_403_when_kein_Lehrperson() {
        given().accept(ContentType.JSON).get("/wettbewerbskontext").then().statusCode(403);
    }

    @Test
    @TestSecurity(user = UUID_LEO_LEMMA)
    void should_anmelden_work_once() {

        final Wettbewerb aktuellerWettbewerb = wettbewerbService.loadAktuellenWettbewerb();

        try {
            final Teilnahme teilnahme = given()
                    .post("/aktuelle-teilnahme")
                    .then()
                    .statusCode(201)
                    .and()
                    .extract()
                    .as(Teilnahme.class);

            // assert
            assertAll(() -> assertNotNull(teilnahme), () -> assertEquals(KUERZEL_LEO_LEMMA, teilnahme.getKuerzel()),
                    () -> assertEquals(aktuellerWettbewerb.getJahr(), teilnahme.getJahr()),
                    () -> assertEquals(Auswertungsart.ONLINE, teilnahme.getAuswertungsart()),
                    () -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, teilnahme.getDurchfuehrungsart()),
                    () -> assertNull(teilnahme.getAngemeldetDurch()),
                    () -> assertEquals(0, teilnahme.getAnzahlKinder()),
                    () -> assertEquals(0, teilnahme.getAnzahlKlassen()),
                    () -> assertEquals(0, teilnahme.getAnzahlLoesungszettel()),
                    () -> assertNotNull(teilnahme.getAngemeldetAm()));

            final Teilnahme aktuelleTeilnahme = given()
                    .get("/aktuelle-teilnahme")
                    .then()
                    .statusCode(200)
                    .and()
                    .extract()
                    .as(Teilnahme.class);

            assertAll(() -> assertNotNull(aktuelleTeilnahme),
                    () -> assertEquals(KUERZEL_LEO_LEMMA, aktuelleTeilnahme.getKuerzel()),
                    () -> assertEquals(aktuellerWettbewerb.getJahr(), aktuelleTeilnahme.getJahr()),
                    () -> assertEquals(Auswertungsart.ONLINE, aktuelleTeilnahme.getAuswertungsart()),
                    () -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, aktuelleTeilnahme.getDurchfuehrungsart()),
                    () -> assertNull(aktuelleTeilnahme.getAngemeldetDurch()),
                    () -> assertEquals(0, aktuelleTeilnahme.getAnzahlKinder()),
                    () -> assertEquals(0, aktuelleTeilnahme.getAnzahlKlassen()),
                    () -> assertEquals(0, aktuelleTeilnahme.getAnzahlLoesungszettel()),
                    () -> assertNotNull(aktuelleTeilnahme.getAngemeldetAm()));

            final ErrorResponse errorResponse = given()
                    .post("/aktuelle-teilnahme")
                    .then()
                    .statusCode(409)
                    .and()
                    .extract()
                    .as(ErrorResponse.class);

            // assert
            assertAll(() -> assertNotNull(errorResponse),
                    () -> assertEquals("Sie haben sich bereits zum aktuellen Wettbewerb angemeldet.",
                            errorResponse.getMessage()));

        } finally {
            cleanupDao.deleteTeilnahme(KUERZEL_LEO_LEMMA, aktuellerWettbewerb.getJahr());
        }

    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON_READ)
    void should_anmelden_return_403_when_not_authorized() {
        given().post("/aktuelle-teilnahme").then().statusCode(403);
    }

    @Test
    void should_anmelden_return_401_when_not_loggedIn() {
        given().post("/aktuelle-teilnahme").then().statusCode(401);
    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON_READ)
    void should_loadAktuellePrivatteilnahme_return_403_when_lehrperson() {
        given().get("/aktuelle-teilnahme").then().statusCode(403);
    }

    @Test
    void should_loadAktuellePrivatteilnahme_return_401_when_not_loggedIn() {
        given().get("/aktuelle-teilnahme").then().statusCode(401);
    }

    @Test
    @TestSecurity(user = "13ec6172-c4db-4e03-9198-d80a1281fb05")
    void should_loadAktuellePrivatteilnahme_return_404_when_not_exists() {
        given().get("/aktuelle-teilnahme").then().statusCode(404);
    }

}
