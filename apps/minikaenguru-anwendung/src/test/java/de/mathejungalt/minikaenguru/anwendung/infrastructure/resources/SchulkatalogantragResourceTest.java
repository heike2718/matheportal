package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schulkatalogantrag;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.TestConstants;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * SchulkatalogantragResourceTest.
 */
@QuarkusTest
@TestHTTPEndpoint(SchulkatalogantragResource.class)
public class SchulkatalogantragResourceTest {

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_return_204_when_successfully_sent_an_antrag() {

        // arrange
        final Schulkatalogantrag antrag = new Schulkatalogantrag()
                .emailAuftraggeber("mail@provider.de")
                .nameLand("Niedersachsen")
                .nameOrt("Hildesheim")
                .nameSchule("Baumgrundschule")
                .plz("12345")
                .strasseUndHausnummer("Niederwaldstraße 12");

        // act + assert
        given().contentType(ContentType.JSON).accept(ContentType.JSON).body(antrag).post().then().statusCode(204);

    }

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_return_400_when_payload_invalid() {

        // arrange

        final Schulkatalogantrag antrag = new Schulkatalogantrag()
                .emailAuftraggeber("keine-mail")
                .nameLand("")
                .nameOrt("Москва")
                .nameSchule("Немецкая школа в Москве им. Ф.Й. Гааза")
                .plz("119526119526119526119")
                .strasseUndHausnummer("проспект Вернадского, д. 103, корп. 5");

        // act
        final ErrorResponse errorResponse = given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(antrag)
                .post()
                .then()
                .statusCode(400)
                .and()
                .extract()
                .as(ErrorResponse.class);

        // assert
        assertEquals(TestConstants.EXPECTED_BAD_REQUEST_MESSAGE, errorResponse.getMessage());

    }

    @Test
    void should_return_401_when_not_authorized() {

        // arrange
        final Schulkatalogantrag antrag = new Schulkatalogantrag()
                .emailAuftraggeber("mail@provider.de")
                .nameLand("Niedersachsen")
                .nameOrt("Hildesheim")
                .nameSchule("Baumgrundschule")
                .plz("12345")
                .strasseUndHausnummer("Niederwaldstraße 12");

        // act + assert
        given().contentType(ContentType.JSON).accept(ContentType.JSON).body(antrag).post().then().statusCode(401);

    }

}
