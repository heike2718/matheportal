package de.mathejungalt.matheportal.shell.infrastructure.resources;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.matheportal.shell.domain.logout.LogoutService;
import de.mathejungalt.matheportal.shell.test.IamIntegrationTestProfile;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.mockito.Mockito.doNothing;

@QuarkusTest
@TestHTTPEndpoint(SessionResource.class)
@TestProfile(IamIntegrationTestProfile.class)
class SessionResourceTest {

    @ConfigProperty(name = "session.cookie.name")
    String sessionCookiName;

    @InjectMock
    LogoutService logoutService;

    @Test
    void testDeleteSesssion() {

        doNothing().when(logoutService).logout();

        given().accept(ContentType.JSON).delete("/").then().statusCode(204).and().cookie(sessionCookiName);

    }

}
