package de.mathejungalt.minikaenguru.admin.infrastructure.resources;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.admin.domain.generated.Land;
import de.mathejungalt.minikaenguru.admin.domain.generated.Ort;
import de.mathejungalt.minikaenguru.admin.domain.generated.Schule;

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

        final Land[] result = given()
                .accept(ContentType.JSON)
                .get("laender")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Land[].class);

        final List<Land> laender = Arrays.asList(result);

        assertEquals(29, laender.size());
        final Land thueringen = laender.get(28);

        assertAll(() -> assertEquals(KUERZEL_LAND, thueringen.getKuerzel()),
                () -> assertEquals("Thüringen", thueringen.getName()),
                () -> assertEquals(288, thueringen.getAnzahlOrte()));

    }

    @Test
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_loadOrte_when_authorized() {

        final String path = "laender/" + KUERZEL_LAND + "/orte";

        final Ort[] result = given()
                .accept(ContentType.JSON)
                .get(path)
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Ort[].class);

        final List<Ort> orte = Arrays.asList(result);

        assertEquals(288, orte.size());
        final Ort apolda = orte.stream().filter(o -> KUERZEL_ORT.equals(o.getKuerzel())).findFirst().get();

        final Land thueringen = apolda.getLand();

        assertAll(() -> assertEquals(KUERZEL_ORT, apolda.getKuerzel()), () -> assertEquals("Apolda", apolda.getName()),
                () -> assertEquals(4, apolda.getAnzahlSchulen()),
                () -> assertEquals(KUERZEL_LAND, thueringen.getKuerzel()),
                () -> assertEquals(0, thueringen.getAnzahlOrte()));
    }

    @Test
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_loadSchulen_when_authorized() {

        final String path = "orte/" + KUERZEL_ORT + "/schulen";

        final Schule[] result = given()
                .accept(ContentType.JSON)
                .get(path)
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Schule[].class);

        final List<Schule> schulen = Arrays.asList(result);

        assertEquals(4, schulen.size());
        final Schule schule = schulen.stream().filter(o -> KUERZEL_SCHULE.equals(o.getKuerzel())).findFirst().get();

        final Ort apolda = schule.getOrt();

        final Land thueringen = apolda.getLand();

        assertAll(() -> assertEquals(KUERZEL_SCHULE, schule.getKuerzel()),
                () -> assertEquals("Gotthold-Ephraim-Lessing-Schule", schule.getName()),
                () -> assertEquals(KUERZEL_ORT, apolda.getKuerzel()), () -> assertEquals(0, apolda.getAnzahlSchulen()),
                () -> assertEquals(KUERZEL_LAND, thueringen.getKuerzel()),
                () -> assertEquals(0, thueringen.getAnzahlOrte()));
    }

    void should_return_401_when_notAuthorized() {

    }

}
