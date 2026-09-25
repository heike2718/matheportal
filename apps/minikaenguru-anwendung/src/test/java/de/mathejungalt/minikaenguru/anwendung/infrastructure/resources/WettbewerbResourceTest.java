package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * WettbewerbResourceTest.
 */
@QuarkusTest
@TestHTTPEndpoint(WettbewerbResource.class)
public class WettbewerbResourceTest {

    @Test
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_load_work() {

        // act
        final Wettbewerb wettbewerb = given()
                .accept(ContentType.JSON)
                .get()
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Wettbewerb.class);

        assertAll(() -> assertNotNull(wettbewerb.getBeginn()), () -> assertNotNull(wettbewerb.getEnde()),
                () -> assertNotNull(wettbewerb.getFreischaltungPrivat()),
                () -> assertNotNull(wettbewerb.getFreischaltungSchulen()), () -> assertNotNull(wettbewerb.getJahr()),
                () -> assertNotNull(wettbewerb.getStatus()));
    }

    @Test
    void should_load_return_401_when_not_authenticated() {

        // act
        given().accept(ContentType.JSON).get().then().statusCode(401);
    }
}
