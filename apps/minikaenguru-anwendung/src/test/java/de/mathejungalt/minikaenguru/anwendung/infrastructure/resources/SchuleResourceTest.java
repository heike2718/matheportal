package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Anmeldestatus;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Auswertungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Person;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.SchuleWettbewerbskontext;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schulkollegium;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Teilnahme;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.UserDetails;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderRestClient;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.CleanupTestDataDao;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestHTTPEndpoint(SchuleResource.class)
public class SchuleResourceTest {

    private static final String UUID_LEHRPERSON = "412b67dc-132f-465a-a3c3-468269e866cb";

    private static final String UUID_SANDRA_SATZ = "6ed7dc4f-8ce5-4d4d-b808-f82901d09206";
    private static final String SCHULE_SANDRA_SATZ = "ZWXTMP2B";
    private static final String UUID_LEO_LEMMA_PRIVATPERSON = "13654c66-970c-40b8-8564-8173a18d41d0";

    private static final String UUID_RITA_REIHE = "c540dbeb-d7fc-48c5-bd60-f860859cc88c";
    private static final String SCHULE_RITA_REIHE = "CSS3MMX7";

    @InjectMock
    @RestClient
    AuthproviderRestClient authproviderRestClient;

    @Inject
    WettbewerbService wettbewerbService;

    @Inject
    CleanupTestDataDao cleanupDao;

    @Test
    @TestSecurity(user = UUID_LEHRPERSON)
    void should_getWettbewerbskontext_work() {

        final String schuleId = "G6307A5U";

        final SchuleWettbewerbskontext result = given()
                .accept(ContentType.JSON)
                .pathParam("schuleId", schuleId)
                .get("wettbewerbskontext")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(SchuleWettbewerbskontext.class);

        final Schule schule = result.getSchule();

        assertAll(() -> assertEquals("Görlitz", schule.getOrt().getName()),
                () -> assertEquals(Anmeldestatus.MOEGLICH, result.getAnmeldestatus()),
                () -> assertEquals(1, result.getTeilnahmerefs().size()),
                () -> assertEquals(2020, result.getTeilnahmerefs().getFirst().getJahr()),
                () -> assertEquals(0, result.getKollegen().size()),
                () -> assertFalse(result.getVertragDSGVOVorhanden()));

    }

    @Test
    void should_getWettbewerbskontext_return_401() {

        final String schuleId = "G6307A5U";

        given()
                .accept(ContentType.JSON)
                .pathParam("schuleId", schuleId)
                .get("wettbewerbskontext")
                .then()
                .statusCode(401);

    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON)
    void should_getWettbewerbskontext_return_403() {

        final String schuleId = "2EX6DENW";

        given()
                .accept(ContentType.JSON)
                .pathParam("schuleId", schuleId)
                .get("wettbewerbskontext")
                .then()
                .statusCode(403);

    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON)
    void should_getKollegen_work() {

        final String schuleId = "F7WAWNTW";

        final UserDetails userDetails = UserDetails.builder().vorname("Anna").nachname("Johanna").build();

        when(authproviderRestClient.getUserDetails(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(userDetails);

        final Schulkollegium result = given()
                .accept(ContentType.JSON)
                .pathParam("schuleId", schuleId)
                .get("kollegium")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Schulkollegium.class);

        assertEquals(schuleId, result.getSchulkuerzel());
        assertEquals(1, result.getKollegium().size());
        assertEquals("Anna Johanna", result.getKollegium().getFirst().getFullName());
        assertEquals("F7WAWNTW", result.getKollegium().getFirst().getSchulkuerzel());
        verify(authproviderRestClient).getUserDetails(anyString(), anyString(), anyString(), anyString());

    }

    @Test
    void should_getKollegen_return_401() {
        final String schuleId = "F7WAWNTW";

        given().accept(ContentType.JSON).pathParam("schuleId", schuleId).get("kollegium").then().statusCode(401);

        verify(authproviderRestClient, never()).getUserDetails(anyString(), anyString(), anyString(), anyString());

    }

    @Test
    void should_getKollegen_return_403() {
        final String schuleId = "2EX6DENW";

        given().accept(ContentType.JSON).pathParam("schuleId", schuleId).get("kollegium").then().statusCode(401);

        verify(authproviderRestClient, never()).getUserDetails(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    @TestSecurity(user = UUID_LEO_LEMMA_PRIVATPERSON)
    void should_loadAktuelleSchulteilnahme_return_400() {

        given().pathParam("schuleId", "M94P3IH9M94P3IH9").get("/aktuelle-teilnahme").then().statusCode(400);

    }

    @Test
    void should_loadAktuelleSchulteilnahme_return_401() {

        given().pathParam("schuleId", SCHULE_SANDRA_SATZ).get("/aktuelle-teilnahme").then().statusCode(401);

    }

    @Test
    @TestSecurity(user = UUID_SANDRA_SATZ)
    void should_loadAktuelleSchulteilnahme_return_403_when_nicht_meine_schule() {

        given().pathParam("schuleId", "M94P3IH9").get("/aktuelle-teilnahme").then().statusCode(403);

    }

    @Test
    @TestSecurity(user = UUID_LEO_LEMMA_PRIVATPERSON)
    void should_loadAktuelleSchulteilnahme_return_403_when_privatperson() {

        given().pathParam("schuleId", "M94P3IH9").get("/aktuelle-teilnahme").then().statusCode(403);

    }

    @Test
    @TestSecurity(user = UUID_RITA_REIHE)
    void should_loadAktuelleSchulteilnahme_return_404_when_nicht_angemeldet() {

        given().pathParam("schuleId", SCHULE_RITA_REIHE).get("/aktuelle-teilnahme").then().statusCode(404);

    }

    @Test
    void should_anmelden_return_401() {

        // arrange
        final Auswertungsart auswertungsart = Auswertungsart.OFFLINE;

        given()
                .pathParam("schuleId", SCHULE_SANDRA_SATZ)
                .queryParam("auswertungsart", auswertungsart)
                .post("/aktuelle-teilnahme")
                .then()
                .statusCode(401);
    }

    @Test
    @TestSecurity(user = UUID_SANDRA_SATZ)
    void should_anmelden_return_403_when_nicht_meine_schule() {

        // arrange
        final String schuleId = "M94P3IH9";
        final Auswertungsart auswertungsart = Auswertungsart.OFFLINE;

        given()
                .pathParam("schuleId", schuleId)
                .queryParam("auswertungsart", auswertungsart)
                .post("/aktuelle-teilnahme")
                .then()
                .statusCode(403);
    }

    @Test
    @TestSecurity(user = UUID_LEO_LEMMA_PRIVATPERSON)
    void should_anmelden_return_403_when_privatperson() {

        // arrange
        final String schuleId = "M94P3IH9";
        final Auswertungsart auswertungsart = Auswertungsart.OFFLINE;

        given()
                .pathParam("schuleId", schuleId)
                .queryParam("auswertungsart", auswertungsart)
                .post("/aktuelle-teilnahme")
                .then()
                .statusCode(403);
    }

    @Test
    @TestSecurity(user = UUID_SANDRA_SATZ)
    void should_anmelden_return_400_when_kuerzel_invalid() {

        // arrange
        final String schuleId = "ZWXTMP2BZWXTMP2B";
        final Auswertungsart auswertungsart = Auswertungsart.OFFLINE;

        given()
                .pathParam("schuleId", schuleId)
                .queryParam("auswertungsart", auswertungsart)
                .post("/aktuelle-teilnahme")
                .then()
                .statusCode(400)
                .and()
                .extract()
                .as(ErrorResponse.class);
    }

    @Test
    @TestSecurity(user = UUID_SANDRA_SATZ)
    void should_anmelden_return_400_when_auswertungsart_fehlt() {

        given()
                .pathParam("schuleId", SCHULE_SANDRA_SATZ)
                .post("/aktuelle-teilnahme")
                .then()
                .statusCode(400)
                .and()
                .extract()
                .as(ErrorResponse.class);
    }

    @Test
    @TestSecurity(user = UUID_SANDRA_SATZ)
    void should_anmelden_work_once() {

        // arrange
        final UserDetails userDetails = UserDetails.builder().vorname("Anna").nachname("Johanna").build();

        when(authproviderRestClient.getUserDetails(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(userDetails);

        final Auswertungsart auswertungsart = Auswertungsart.OFFLINE;

        final Wettbewerb aktuellerWettbewerb = wettbewerbService.loadAktuellenWettbewerb();

        try {
            final Teilnahme teilnahme = given()
                    .pathParam("schuleId", SCHULE_SANDRA_SATZ)
                    .queryParam("auswertungsart", auswertungsart)
                    .post("/aktuelle-teilnahme")
                    .then()
                    .statusCode(201)
                    .and()
                    .extract()
                    .as(Teilnahme.class);

            // assert
            assertAll(() -> assertNotNull(teilnahme), () -> assertEquals(SCHULE_SANDRA_SATZ, teilnahme.getKuerzel()),
                    () -> assertEquals(aktuellerWettbewerb.getJahr(), teilnahme.getJahr()),
                    () -> assertEquals(Auswertungsart.OFFLINE, teilnahme.getAuswertungsart()),
                    () -> assertEquals(Wettbewerbsdurchfuehrungsart.SCHULE, teilnahme.getDurchfuehrungsart()),
                    () -> assertNull(teilnahme.getAngemeldetDurch()),
                    () -> assertEquals(0, teilnahme.getAnzahlKinder()),
                    () -> assertEquals(0, teilnahme.getAnzahlKlassen()),
                    () -> assertEquals(0, teilnahme.getAnzahlLoesungszettel()),
                    () -> assertNotNull(teilnahme.getAngemeldetAm()));

            final Teilnahme aktuelleTeilnahme = given()
                    .pathParam("schuleId", SCHULE_SANDRA_SATZ)
                    .get("/aktuelle-teilnahme")
                    .then()
                    .statusCode(200)
                    .and()
                    .extract()
                    .as(Teilnahme.class);

            assertAll(() -> assertNotNull(aktuelleTeilnahme),
                    () -> assertEquals(SCHULE_SANDRA_SATZ, aktuelleTeilnahme.getKuerzel()),
                    () -> assertEquals(aktuellerWettbewerb.getJahr(), aktuelleTeilnahme.getJahr()),
                    () -> assertEquals(Auswertungsart.OFFLINE, teilnahme.getAuswertungsart()),
                    () -> assertEquals(Wettbewerbsdurchfuehrungsart.SCHULE, aktuelleTeilnahme.getDurchfuehrungsart()),
                    () -> assertNull(aktuelleTeilnahme.getAngemeldetDurch()),
                    () -> assertEquals(0, aktuelleTeilnahme.getAnzahlKinder()),
                    () -> assertEquals(0, aktuelleTeilnahme.getAnzahlKlassen()),
                    () -> assertEquals(0, aktuelleTeilnahme.getAnzahlLoesungszettel()),
                    () -> assertNotNull(aktuelleTeilnahme.getAngemeldetAm()));

            final Person person = given()
                    .pathParam("schuleId", SCHULE_SANDRA_SATZ)
                    .get("/aktuelle-teilnahme/anmeldende-person")
                    .then()
                    .statusCode(200)
                    .and()
                    .extract()
                    .as(Person.class);

            assertAll(() -> assertEquals("Anna Johanna", person.getFullName()),
                    () -> assertEquals(SCHULE_SANDRA_SATZ, person.getSchulkuerzel()),
                    () -> verify(authproviderRestClient)
                            .getUserDetails(anyString(), anyString(), anyString(), anyString()));

            final ErrorResponse errorResponse = given()
                    .pathParam("schuleId", SCHULE_SANDRA_SATZ)
                    .queryParam("auswertungsart", auswertungsart)
                    .post("/aktuelle-teilnahme")
                    .then()
                    .statusCode(409)
                    .and()
                    .extract()
                    .as(ErrorResponse.class);

            // assert
            assertAll(() -> assertNotNull(errorResponse),
                    () -> assertEquals("Die Schule ist bereits zum aktuellen Wettbewerb angemeldet.",
                            errorResponse.getMessage()));

        } finally {
            cleanupDao.deleteTeilnahme(SCHULE_SANDRA_SATZ, aktuellerWettbewerb.getJahr());
        }

    }

    @Test
    @TestSecurity(user = UUID_SANDRA_SATZ)
    void should_loadAnmeldendePerson_return_400() {

        given()
                .pathParam("schuleId", "KURZEL_MIT_UNTERSTRICH")
                .get("/aktuelle-teilnahme/anmeldende-person")
                .then()
                .statusCode(400);

        verify(authproviderRestClient, never()).getUserDetails(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    void should_loadAnmeldendePerson_return_401() {

        given()
                .pathParam("schuleId", SCHULE_SANDRA_SATZ)
                .get("/aktuelle-teilnahme/anmeldende-person")
                .then()
                .statusCode(401);

        verify(authproviderRestClient, never()).getUserDetails(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    @TestSecurity(user = UUID_LEO_LEMMA_PRIVATPERSON)
    void should_loadAnmeldendePerson_return_403_when_privatperson() {

        given()
                .pathParam("schuleId", SCHULE_SANDRA_SATZ)
                .get("/aktuelle-teilnahme/anmeldende-person")
                .then()
                .statusCode(403);

        verify(authproviderRestClient, never()).getUserDetails(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    @TestSecurity(user = UUID_SANDRA_SATZ)
    void should_loadAnmeldendePerson_return_403_when_nicht_erlaubte_schule() {

        given()
                .pathParam("schuleId", SCHULE_RITA_REIHE)
                .get("/aktuelle-teilnahme/anmeldende-person")
                .then()
                .statusCode(403);

        verify(authproviderRestClient, never()).getUserDetails(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    @TestSecurity(user = UUID_RITA_REIHE)
    void should_loadAnmeldendePerson_return_404_when_schule_nicht_angemeldet() {

        given()
                .pathParam("schuleId", SCHULE_RITA_REIHE)
                .get("/aktuelle-teilnahme/anmeldende-person")
                .then()
                .statusCode(404);

        verify(authproviderRestClient, never()).getUserDetails(anyString(), anyString(), anyString(), anyString());
    }
}
