package de.mathejungalt.minikaenguru.admin.infrastructure.resources;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.admin.domain.generated.LandReadonly;
import de.mathejungalt.minikaenguru.admin.domain.generated.OrtReadonly;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleReadonly;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestHTTPEndpoint(SchulkatalogResource.class)
public class SchulkatalogResourceSucheTest {

    private static final String KUERZEL_LAND = "DE-TH";
    private static final String KUERZEL_ORT = "46AL373N";
    private static final String KUERZEL_SCHULE = "M2ROAYLG";

    @Test
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_loadLaender_when_authorized() {

        final LandReadonly[] result = given()
                .accept(ContentType.JSON)
                .get("laender")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(LandReadonly[].class);

        final List<LandReadonly> laender = Arrays.asList(result);

        assertEquals(29, laender.size());
        final LandReadonly thueringen = laender.get(28);

        assertAll(() -> assertEquals(KUERZEL_LAND, thueringen.getKuerzel()),
                () -> assertEquals("Thüringen", thueringen.getName()),
                () -> assertEquals(288, thueringen.getAnzahlOrte()));

    }

    @Test
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_loadOrte_when_authorized() {

        final String path = "laender/" + KUERZEL_LAND + "/orte";

        final OrtReadonly[] result = given()
                .accept(ContentType.JSON)
                .get(path)
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(OrtReadonly[].class);

        final List<OrtReadonly> orte = Arrays.asList(result);

        assertEquals(288, orte.size());
        final OrtReadonly apolda = orte.stream().filter(o -> KUERZEL_ORT.equals(o.getKuerzel())).findFirst().get();

        final LandReadonly thueringen = apolda.getLand();

        assertAll(() -> assertEquals(KUERZEL_ORT, apolda.getKuerzel()), () -> assertEquals("Apolda", apolda.getName()),
                () -> assertEquals(4, apolda.getAnzahlSchulen()),
                () -> assertEquals(KUERZEL_LAND, thueringen.getKuerzel()),
                () -> assertEquals(0, thueringen.getAnzahlOrte()));
    }

    @Test
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_loadSchulen_when_authorized() {

        final String path = "orte/" + KUERZEL_ORT + "/schulen";

        final SchuleReadonly[] result = given()
                .accept(ContentType.JSON)
                .get(path)
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(SchuleReadonly[].class);

        final List<SchuleReadonly> schulen = Arrays.asList(result);

        assertEquals(4, schulen.size());
        final SchuleReadonly schule = schulen
                .stream()
                .filter(o -> KUERZEL_SCHULE.equals(o.getKuerzel()))
                .findFirst()
                .get();

        final OrtReadonly apolda = schule.getOrt();

        final LandReadonly thueringen = apolda.getLand();

        assertAll(() -> assertEquals(KUERZEL_SCHULE, schule.getKuerzel()),
                () -> assertEquals("Gotthold-Ephraim-Lessing-Schule", schule.getName()),
                () -> assertEquals(KUERZEL_ORT, apolda.getKuerzel()), () -> assertEquals(0, apolda.getAnzahlSchulen()),
                () -> assertEquals(KUERZEL_LAND, thueringen.getKuerzel()),
                () -> assertEquals(0, thueringen.getAnzahlOrte()));
    }

    void should_return_401_when_notAuthorized() {

    }

}
