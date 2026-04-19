package de.mathejungalt.matheportal.shell.infrastructure.resources;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

import de.mathejungalt.matheportal.shell.domain.generated.AuthUrlResponse;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
@TestHTTPEndpoint(SessionResource.class)
public class SessionResourceTest {

    // @Test
    void test_loginUrl() {

        // act
        final AuthUrlResponse authUrlResponse = given()
                .accept(ContentType.JSON)
                .get("/authurls/login")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(AuthUrlResponse.class);

        // assert
        assertTrue(authUrlResponse.getUrl().startsWith("http://localhost:9000/authprovider/login"));

    }

}
