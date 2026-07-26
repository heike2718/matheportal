package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Ort;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@QuarkusTest
@TestHTTPEndpoint(SchulkatalogResource.class)
public class SchulkatalogResourceTest {

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_findOrte_when_exist() {

        final Ort[] orte = given()
                .accept(ContentType.JSON)
                .queryParam("name", "halle")
                .get()
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Ort[].class);

        final List<Ort> list = Arrays.asList(orte);

        final int index = 1;

        assertAll(() -> assertEquals(5, list.size()), () -> assertEquals("27CM5KFF", list.get(index).getKuerzel()),
                () -> assertEquals("27CM5KFF", list.get(index).getKuerzel()),
                () -> assertEquals("Halle (Saale)", list.get(index).getName()),
                () -> assertEquals("DE-ST", list.get(index).getLand().getKuerzel()),
                () -> assertEquals("Sachsen-Anhalt", list.get(index).getLand().getName()),
                () -> assertEquals(19, list.get(index).getAnzahlSchulen()));

    }

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_findOrte_sucht_mit_praefix() {

        final Ort[] orte = given()
                .accept(ContentType.JSON)
                .queryParam("name", "berl")
                .get()
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Ort[].class);

        final List<Ort> list = Arrays.asList(orte);

        assertEquals(3, list.size());

    }

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_findOrte_no_result() {

        final Ort[] orte = given()
                .accept(ContentType.JSON)
                .queryParam("name", "ein vollkommen unbekannter ort")
                .get()
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Ort[].class);

        assertEquals(0, orte.length);
    }

    @Test
    void should_findOrte_unauthorized() {

        given().accept(ContentType.JSON).queryParam("name", "halle").get().then().statusCode(401);
    }

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_loadSchulen_when_ort_exists() {

        final String ortId = "RV0JFG9U";
        final Schule[] schulen = given()
                .accept(ContentType.JSON)
                .pathParam("ortId", ortId)
                .get("{ortId}/schulen")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Schule[].class);

        final List<Schule> list = Arrays.asList(schulen);

        assertAll(() -> assertEquals(4, list.size()), () -> assertEquals("0MUAZR9S", list.get(1).getKuerzel()),
                () -> assertEquals("Gem. Grundschule Künsebeck", list.get(1).getName()),
                () -> assertEquals(ortId, list.get(1).getOrt().getKuerzel()),
                () -> assertEquals("Halle (Westf.)", list.get(1).getOrt().getName()),
                () -> assertNull(list.get(1).getOrt().getAnzahlSchulen()));

    }

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_loadSchulen_when_ort_does_not_exist() {

        final String ortId = "GIBTESNICHT";
        final Schule[] schulen = given()
                .accept(ContentType.JSON)
                .pathParam("ortId", ortId)
                .get("{ortId}/schulen")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Schule[].class);

        assertEquals(0, schulen.length);
    }

    @Test
    void should_loadSchulen_unauthorized() {

        final String ortId = "RV0JFG9U";
        given().accept(ContentType.JSON).pathParam("ortId", ortId).get("{ortId}/schulen").then().statusCode(401);
    }

}
