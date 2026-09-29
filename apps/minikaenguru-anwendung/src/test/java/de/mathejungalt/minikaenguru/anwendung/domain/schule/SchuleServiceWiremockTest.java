package de.mathejungalt.minikaenguru.anwendung.domain.schule;

import jakarta.inject.Inject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.github.tomakehurst.wiremock.WireMockServer;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderHttpException;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderRestClient;
import de.mathejungalt.minikaenguru.anwendung.test.InjectWireMock;
import de.mathejungalt.minikaenguru.anwendung.test.WireMockAuthprovider;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

/**
 * SchuleServiceWiremockTest.
 */
@QuarkusTest
@QuarkusTestResource(WireMockAuthprovider.class)
public class SchuleServiceWiremockTest {

    private static final String USER_UUID = "412b67dc-132f-465a-a3c3-468269e866cb";
    private static final String URL = "/api/users/412b67dc-132f-465a-a3c3-468269e866cb/name";

    @ConfigProperty(name = "client.id")
    String clientId;

    @ConfigProperty(name = "client.secret")
    String clientSecret;

    @Inject
    @RestClient
    AuthproviderRestClient authproviderRestClient;

    @InjectWireMock
    WireMockServer wireMockServer;

    @Inject
    SchuleService schuleService;

    @BeforeEach
    void setup() {
        wireMockServer.resetAll();
    }

    @Test
    void should_getUserDetails_when_exists() {

        // arrange
        wireMockServer
                .stubFor(get(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                                                                    {
                                          "vorname": "Frodo",
                                          "nachname": "Beutlin aus Beutelsend"
                                        }
                                                                                """)));

        // act
        final String kollege = schuleService.loadKollege(USER_UUID);

        // assert
        assertEquals("Frodo Beutlin aus Beutelsend", kollege);

        wireMockServer
                .verify(1,
                        getRequestedFor(urlEqualTo(URL))
                                .withHeader("X-CLIENT-ID", equalTo(clientId))
                                .withHeader("X-CLIENT-SECRET", equalTo(clientSecret))
                                .withHeader("X-NONCE",
                                        matching("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")));
    }

    @Test
    void should_getUserDetails_return_null_when_payload_null() {

        // arrange
        wireMockServer.stubFor(get(urlEqualTo(URL)).willReturn(aResponse().withStatus(200)));

        // act
        final String kollege = schuleService.loadKollege(USER_UUID);

        // assert
        assertNull(kollege);

        wireMockServer
                .verify(1,
                        getRequestedFor(urlEqualTo(URL))
                                .withHeader("X-CLIENT-ID", equalTo(clientId))
                                .withHeader("X-CLIENT-SECRET", equalTo(clientSecret))
                                .withHeader("X-NONCE",
                                        matching("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")));
    }

    @Test
    void should_throw_AuthproviderHttpException_with_message_from_responseBody() {

        // arrange
        final int status = 400;

        wireMockServer
                .stubFor(get(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(status)
                                .withHeader("Content-Type", "application/json")
                                .withBody("""
                                        {"level": "ERROR", "message": "eine Fehlermeldung"}
                                        """)));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> authproviderRestClient
                        .getUserDetails(USER_UUID, clientId, clientSecret, "412b67dc-132f-465a-a3c3-468269e866cb"));

        // assert
        assertEquals(status, exception.getStatus());
        assertEquals("eine Fehlermeldung", exception.getMessage());
    }

    @Test
    void should_throw_AuthproviderHttpException_with_general_message_when_body_null() {

        // arrange
        final int status = 400;

        final String expectedErrorMessage = "authprovider hat bei http-Status 400 keine vertragsgemaesse Fehlerantwort geliefert. Erwartet wurde MessagePayload. Die response payload war leer oder konnte nicht entsprechend deserialisiert werden.\n";

        wireMockServer
                .stubFor(get(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(status)
                                .withHeader("Content-Type", "application/json")
                                .withBody("null")));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> authproviderRestClient
                        .getUserDetails(USER_UUID, clientId, clientSecret, "412b67dc-132f-465a-a3c3-468269e866cb"));

        // assert
        assertEquals(status, exception.getStatus());
        assertEquals(expectedErrorMessage, exception.getMessage());
    }

    @Test
    void should_throw_AuthproviderHttpException_with_general_message_when_unparseable() {

        // arrange
        final int status = 400;

        final String expectedErrorMessage = "authprovider hat bei http-Status 400 keine vertragsgemaesse Fehlerantwort geliefert. Erwartet wurde MessagePayload. Die response payload war leer oder konnte nicht entsprechend deserialisiert werden.\n";

        wireMockServer
                .stubFor(get(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(status)
                                .withHeader("Content-Type", "application/json")
                                .withBody("\"{\"level\": \"ERROR\",\"")));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> authproviderRestClient
                        .getUserDetails(USER_UUID, clientId, clientSecret, "412b67dc-132f-465a-a3c3-468269e866cb"));

        // assert
        assertEquals(status, exception.getStatus());
        assertEquals(expectedErrorMessage, exception.getMessage());
    }

    @ParameterizedTest
    @CsvSource({ "404", "500", "503", "504" })
    void should_getUserDetails_return_null_when_this_status(final int status) {

        // arrange
        wireMockServer.stubFor(get(urlEqualTo(URL)).willReturn(aResponse().withStatus(status)));

        // act
        final String kollege = schuleService.loadKollege(USER_UUID);

        // assert
        assertNull(kollege);

        wireMockServer
                .verify(1,
                        getRequestedFor(urlEqualTo(URL))
                                .withHeader("X-CLIENT-ID", equalTo(clientId))
                                .withHeader("X-CLIENT-SECRET", equalTo(clientSecret))
                                .withHeader("X-NONCE",
                                        matching("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")));
    }

    @Test
    void should_not_catch_AuthproviderHttpException_when_status_400() {

        // arrange
        wireMockServer
                .stubFor(get(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(400)
                                .withHeader("Content-Type", "application/json")
                                .withBody(
                                        """
                                                                                                                                                                                    {
                                                  "level": "ERROR",
                                                  "message": "eine Fehlermeldung"
                                                }
                                                                                                                                                                                """)));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> schuleService.loadKollege(USER_UUID));

        // assert
        assertAll(() -> assertEquals(400, exception.getStatus()),
                () -> assertEquals("eine Fehlermeldung", exception.getMessage()),
                () -> wireMockServer
                        .verify(1, getRequestedFor(urlEqualTo(URL))
                                .withHeader("X-CLIENT-ID", equalTo(clientId))
                                .withHeader("X-CLIENT-SECRET", equalTo(clientSecret))
                                .withHeader("X-NONCE",
                                        matching("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"))));

    }

    @ParameterizedTest
    @CsvSource({ "401,Konfiguration der Kommunikation mit authprovider ist falsch. client.id und client.secret prüfen.",
            "403,client.id ist im authprovider nicht korrekt konfiguriert. Dort matheportal.minikaenguru.clientid prüfen." })
    void should_not_catch_AuthproviderHttpException_when_this_status(final int status,
            final String expectedErrorMessage) {

        // arrange
        wireMockServer
                .stubFor(get(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(status)
                                .withHeader("Content-Type", "application/json")
                                .withBody(
                                        """
                                                                                                                                                                                    {
                                                  "level": "ERROR",
                                                  "message": "eine Fehlermeldung"
                                                }
                                                                                                                                                                                """)));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> schuleService.loadKollege(USER_UUID));

        // assert
        assertAll(() -> assertEquals(status, exception.getStatus()),
                () -> assertEquals(expectedErrorMessage, exception.getMessage()),
                () -> wireMockServer
                        .verify(1, getRequestedFor(urlEqualTo(URL))
                                .withHeader("X-CLIENT-ID", equalTo(clientId))
                                .withHeader("X-CLIENT-SECRET", equalTo(clientSecret))
                                .withHeader("X-NONCE",
                                        matching("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"))));
    }

    @ParameterizedTest
    @CsvSource({ "409", "429" })
    void should_not_catch_AuthproviderHttpException_unexpected_status(final int status) {

        // arrange
        final String expectedErrorMessage = "authprovider antwortet mit unerwartetem http-Status " + status;

        wireMockServer
                .stubFor(get(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(status)
                                .withHeader("Content-Type", "application/json")
                                .withBody(
                                        """
                                                                                                                                                                                    {
                                                  "level": "ERROR",
                                                  "message": "eine Fehlermeldung"
                                                }
                                                                                                                                                                                """)));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> schuleService.loadKollege(USER_UUID));

        // assert
        assertAll(() -> assertEquals(status, exception.getStatus()),
                () -> assertEquals(expectedErrorMessage, exception.getMessage()),
                () -> wireMockServer
                        .verify(1, getRequestedFor(urlEqualTo(URL))
                                .withHeader("X-CLIENT-ID", equalTo(clientId))
                                .withHeader("X-CLIENT-SECRET", equalTo(clientSecret))
                                .withHeader("X-NONCE",
                                        matching("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"))));
    }

    @Test
    void test_readTimeout() {
        wireMockServer
                .stubFor(get(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withFixedDelay(3500)
                                .withHeader("Content-Type", "application/json")
                                .withBody("""
                                                                                    {
                                          "vorname": "Frodo",
                                          "nachname": "Beutlin aus Beutelsend"
                                        }
                                                                                """)));

        // act
        final String kollege = schuleService.loadKollege(USER_UUID);

        // assert
        assertNull(kollege);

        wireMockServer
                .verify(1,
                        getRequestedFor(urlEqualTo(URL))
                                .withHeader("X-CLIENT-ID", equalTo(clientId))
                                .withHeader("X-CLIENT-SECRET", equalTo(clientSecret))
                                .withHeader("X-NONCE",
                                        matching("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")));

    }
}
