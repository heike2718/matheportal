package de.mathejungalt.matheportal.shell.infrastructure.resources;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;

import de.mathejungalt.matheportal.shell.domain.generated.AuthUrlResponse;
import de.mathejungalt.matheportal.shell.test.IamIntegrationTestProfile;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
@TestHTTPEndpoint(AuthurlsResource.class)
@TestProfile(IamIntegrationTestProfile.class)
class AuthurlsResourceTest {

    @Test
    void test_loginUrl() {

        // act
        final AuthUrlResponse authUrlResponse = given()
                .accept(ContentType.JSON)
                .get("/")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(AuthUrlResponse.class);

        // assert
        final String authUrl = authUrlResponse.getUrl();

        assertAll(() -> assertTrue(authUrl.startsWith("http://localhost:9000/authprovider/login?accessToken=")),
                () -> assertTrue(authUrl.endsWith("&state=login&redirectUrl=http://localhost:9100/matheportal/")));
    }

}
