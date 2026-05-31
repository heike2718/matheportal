package de.mathejungalt.matheportal.shell.infrastructure.resources;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;

import de.mathejungalt.authsessions.api.SessionConstants;
import de.mathejungalt.matheportal.shell.domain.logout.LogoutService;
import de.mathejungalt.matheportal.shell.test.IamIntegrationTestProfile;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestHTTPEndpoint(SessionResource.class)
@TestProfile(IamIntegrationTestProfile.class)
class SessionResourceTest {

    @InjectMock
    LogoutService logoutService;

    @Test
    void testDeleteSesssion() {

        doNothing().when(logoutService).logout();

        given()
                .accept(ContentType.JSON)
                .delete("/")
                .then()
                .statusCode(204)
                .and()
                .cookie(SessionConstants.SESSION_COOKIE_NAME);

    }

}
