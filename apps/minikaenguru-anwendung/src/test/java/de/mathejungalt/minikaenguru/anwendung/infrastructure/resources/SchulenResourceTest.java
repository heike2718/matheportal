package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.SchuleWettbewerbskontext;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.UserDetails;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderRestClient;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestHTTPEndpoint(SchulenResource.class)
public class SchulenResourceTest {

    private static final String UUID_LEHRPERSON = "412b67dc-132f-465a-a3c3-468269e866cb";

    @InjectMock
    @RestClient
    AuthproviderRestClient authproviderRestClient;

    @Test
    @TestSecurity(user = UUID_LEHRPERSON)
    void should_getWettbewerbskontext_work() {

        final String schuleId = "G6307A5U";

        final SchuleWettbewerbskontext result = given()
                .accept(ContentType.JSON)
                .pathParam("schuleId", schuleId)
                .get()
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
                () -> assertTrue(result.getAnmeldungMoeglich()),
                () -> assertEquals(1, result.getTeilnahmerefs().size()),
                () -> assertEquals(2020, result.getTeilnahmerefs().getFirst().getJahr()),
                () -> assertEquals(0, result.getKollegen().size()),
                () -> assertFalse(result.getVertragDSGVOVorhanden()));

    }

    @Test
    void should_getWettbewerbskontext_return_401() {

        final String schuleId = "G6307A5U";

        given().accept(ContentType.JSON).pathParam("schuleId", schuleId).get().then().statusCode(401);

    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON)
    void should_getWettbewerbskontext_return_403() {

        final String schuleId = "2EX6DENW";

        given().accept(ContentType.JSON).pathParam("schuleId", schuleId).get().then().statusCode(403);

    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON)
    void should_getKollegen_work() {

        final String schuleId = "F7WAWNTW";

        final UserDetails userDetails = UserDetails.builder().vorname("Anna").nachname("Johanna").build();

        when(authproviderRestClient.getUserDetails(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(userDetails);

        final String[] result = given()
                .accept(ContentType.JSON)
                .pathParam("schuleId", schuleId)
                .get("kollegen")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(String[].class);

        assertEquals(1, result.length);
        assertEquals("Anna Johanna", result[0]);
        verify(authproviderRestClient).getUserDetails(anyString(), anyString(), anyString(), anyString());

    }

    @Test
    void should_getKollegen_return_401() {
        final String schuleId = "F7WAWNTW";

        given().accept(ContentType.JSON).pathParam("schuleId", schuleId).get("kollegen").then().statusCode(401);

        verify(authproviderRestClient, never()).getUserDetails(anyString(), anyString(), anyString(), anyString());

    }

    @Test
    void should_getKollegen_return_403() {
        final String schuleId = "2EX6DENW";

        given().accept(ContentType.JSON).pathParam("schuleId", schuleId).get("kollegen").then().statusCode(401);

        verify(authproviderRestClient, never()).getUserDetails(anyString(), anyString(), anyString(), anyString());
    }
}
