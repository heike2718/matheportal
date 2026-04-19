package de.mathejungalt.matheportal.shell.domain.clientauth;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.jboss.resteasy.reactive.ClientWebApplicationException;

import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.post;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.core.JsonParseException;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.http.Fault;

import de.mathejungalt.matheportal.shell.domain.exception.IamResponseException;
import de.mathejungalt.matheportal.shell.domain.exception.RestCommunicationFailedException;
import de.mathejungalt.matheportal.shell.domain.exception.RestResponseProcessingException;
import de.mathejungalt.matheportal.shell.test.InjectWireMock;
import de.mathejungalt.matheportal.shell.test.WireMockAuthprovider;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;

@QuarkusTest
@QuarkusTestResource(WireMockAuthprovider.class)
class InitAccessTokenDelegateTest {

    private static final String URL = "/api/clients/client/accesstoken";

    @InjectWireMock
    WireMockServer wireMockServer;

    @Inject
    InitAccessTokenDelegate initAccessTokenDelegate;

    OAuthClientCredentials credentials;

    @BeforeEach
    void setup() {
        credentials = OAuthClientCredentials.builder().build();
        wireMockServer.resetAll();
    }

    @Test
    void shouldReturnOauthClientAccessToken_whenSuccess() {

        // arrange
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                            {
                                                "messagePayload": {"level":"INFO","message":"ok"},
                                                "data": {
                                                    "nonce": "test-nonce-123",
                                                    "accessToken": "test-access-token-abc"
                                                }
                                            }
                                        """)));

        // act
        final OauthClientAccessToken result = initAccessTokenDelegate.authenticateClient(credentials);

        // assert
        assertAll(() -> assertEquals("test-nonce-123", result.getNonce()),
                () -> assertEquals("test-access-token-abc", result.getAccessToken()));

    }

    @Test
    void shouldThrowIamResponseException_when401() {

        // arrange
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(401).withHeader("Content-Type", "application/json").withBody("""
                                            {"messagePayload":{"level":"ERROR","message":"Unauthorized"},"data":null}
                                        """)));

        // act
        final IamResponseException exception = assertThrows(IamResponseException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        // assert
        assertAll(() -> assertEquals(401, exception.getHttpStatus()),
                () -> assertNotNull(exception.getResponsePayload()),
                () -> assertNotNull(exception.getResponsePayload().getMessagePayload()),
                () -> assertEquals("ERROR", exception.getResponsePayload().getMessagePayload().getLevel()),
                () -> assertEquals("Unauthorized", exception.getResponsePayload().getMessagePayload().getMessage()),
                () -> assertNull(exception.getResponsePayload().getData()));
    }

    @Test
    void shouldThrowRestCommunicationFailedException_whenConnectionReset() {
        wireMockServer.stubFor(post(urlEqualTo(URL)).willReturn(aResponse().withFault(Fault.CONNECTION_RESET_BY_PEER)));

        assertThrows(RestCommunicationFailedException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));
    }

    @Test
    void shouldThrowRestResponseProcessingException_whenDataMapIncomplete_both_missing() {
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                            {
                                                "messagePayload": {"level":"INFO","message":"ok"},
                                                "data": {
                                                    "someOtherKey": "someValue"
                                                }
                                            }
                                        """)));

        final RestResponseProcessingException exception = assertThrows(RestResponseProcessingException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder accessToken fehlen",
                exception.getMessage());

    }

    @Test
    void shouldThrowRestResponseProcessingException_whenDataMapIncomplete_nonce_missing() {
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                            {
                                                "messagePayload": {"level":"INFO","message":"ok"},
                                                "data": {
                                                    "someOtherKey": "someValue",
                                                    "accessToken": "test-access-token-abc"
                                                }
                                            }
                                        """)));

        final RestResponseProcessingException exception = assertThrows(RestResponseProcessingException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder accessToken fehlen",
                exception.getMessage());

    }

    @Test
    void shouldThrowRestResponseProcessingException_whenDataMapIncomplete_accessToken_missing() {
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                            {
                                                "messagePayload": {"level":"INFO","message":"ok"},
                                                "data": {
                                                    "someOtherKey": "someValue",
                                                    "nonce": "test-nonce-123"
                                                }
                                            }
                                        """)));

        final RestResponseProcessingException exception = assertThrows(RestResponseProcessingException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder accessToken fehlen",
                exception.getMessage());

    }

    @Test
    void shouldThrowRestResponseProcessingException_when_invalidJson() {
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("{ ungültiges json <<")));

        final RestResponseProcessingException exception = assertThrows(RestResponseProcessingException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertAll(() -> assertTrue(exception
                .getMessage()
                .startsWith(
                        "Kommunikationsfehler beim Anfordern eines client-accessTokens (response payload ist invalides json): ")),
                () -> assertInstanceOf(JsonParseException.class, exception.getCause()));
    }

    @Test
    void shouldThrowRestCommunicationFailedException_whenNotJson() {
        // arrange
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "text/html")
                                .withBody(
                                        """
                                                    <!DOCTYPE html>
                                                    <html>
                                                        <head><title>502 Bad Gateway</title></head>
                                                        <body>
                                                            <h1>Bad Gateway</h1>
                                                            <p>The proxy server received an invalid response from an upstream server.</p>
                                                        </body>
                                                    </html>
                                                """)));

        final RestCommunicationFailedException exception = assertThrows(RestCommunicationFailedException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertAll(() -> assertTrue(
                exception.getMessage().startsWith("Kommunikationsfehler beim Anfordern eines client-accessTokens: ")),
                () -> assertInstanceOf(ProcessingException.class, exception.getCause()));
    }
}
