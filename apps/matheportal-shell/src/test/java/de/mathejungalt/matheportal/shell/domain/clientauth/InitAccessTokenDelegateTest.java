package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.inject.Inject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.http.Fault;

import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderHttpException;
import de.mathejungalt.matheportal.shell.test.InjectWireMock;
import de.mathejungalt.matheportal.shell.test.WireMockAuthprovider;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;

@QuarkusTest
@QuarkusTestResource(WireMockAuthprovider.class)
class InitAccessTokenDelegateTest {

    private static final String URL = "/api/clients/client/accesstoken/v2";

    @InjectWireMock
    WireMockServer wireMockServer;

    @Inject
    InitAccessTokenDelegate initAccessTokenDelegate;

    OAuthClientCredentials credentials;

    @BeforeEach
    void setup() {
        credentials = OAuthClientCredentials.builder().nonce("test-nonce-123").build();
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
                                          "accessToken": "test-access-token-abc",
                                          "expiresAt": 1793028904951,
                                          "nonce": "test-nonce-123"
                                        }
                                                                                """)));

        // act
        final OauthClientAccessToken result = initAccessTokenDelegate.authenticateClient(credentials);

        // assert
        assertAll(() -> assertEquals("test-nonce-123", result.getNonce()),
                () -> assertEquals("test-access-token-abc", result.getAccessToken()));

    }

    @Test
    void shouldthrowAuthproviderHttpException_when401() {

        // arrange
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(401)
                                .withHeader("Content-Type", "application/json")
                                .withBody(
                                        """
                                                                                            {
                                                  "level": "ERROR",
                                                  "message": "Das hat leider nicht geklappt: Client mit dieser ClientID unbekannt."
                                                }
                                                                                        """)));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        // assert
        assertEquals(
                "Konfiguration des AuthproviderRestClient-Aufrufs ist falsch - client.id und client.secret prüfen.",
                exception.getMessage());
        assertEquals(401, exception.getStatus());
    }

    @Test
    void should_throwAuthproviderHttpException_whenConnectionReset() {
        wireMockServer.stubFor(post(urlEqualTo(URL)).willReturn(aResponse().withFault(Fault.CONNECTION_RESET_BY_PEER)));

        assertThrows(AuthproviderHttpException.class, () -> initAccessTokenDelegate.authenticateClient(credentials));
    }

    @Test
    void should_throwAuthproviderHttpException_whenDataMapIncomplete_both_missing() {
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                                                                    {
                                          "expiresAt": 1793028904951
                                        }
                                                                                """)));

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertEquals("IAM-Antwort hat das nonce geaendert: erwartetes nonce=test-nonce-123, aktuell=null",
                exception.getMessage());
        assertEquals(502, exception.getStatus());
    }

    @Test
    void should_throwAuthproviderHttpException_whenDataMapIncomplete_nonce_missing() {
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                                                                    {
                                          "accessToken": "test-access-token-abc",
                                          "expiresAt": 1793028904951
                                        }
                                                                                """)));

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertEquals("IAM-Antwort hat das nonce geaendert: erwartetes nonce=test-nonce-123, aktuell=null",
                exception.getMessage());
        assertEquals(502, exception.getStatus());

    }

    @Test
    void should_throwAuthproviderHttpException_whenDataMapIncomplete_accessToken_missing() {
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                                                                    {
                                          "expiresAt": 1793028904951,
                                          "nonce": "test-nonce-123"
                                        }
                                                                                """)));

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: accessToken fehlt", exception.getMessage());
        assertEquals(502, exception.getStatus());

    }

    @Test
    void should_throwAuthproviderHttpException_when_invalidJson() {

        // arrange
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("{ ungültiges json <<")));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        // assert
        assertEquals("IAM antwortet mit unerwarteter response payload beim Authentifizieren des Clients",
                exception.getMessage());
        assertEquals(502, exception.getStatus());

    }

    @Test
    void should_throwAuthproviderHttpException_whenNotJson() {
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

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertEquals("IAM antwortet mit unerwarteter response payload beim Authentifizieren des Clients",
                exception.getMessage());
        assertEquals(502, exception.getStatus());
    }

    @Test
    void should_throwAuthproviderHttpException_when_bodyNull() {
        // arrange
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("null")));

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertEquals("IAM antwortet mit unerwarteter response payload 'null' beim Authentifizieren des Clients",
                exception.getMessage());
        assertEquals(502, exception.getStatus());

    }
}
