package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.inject.Inject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.http.Fault;

import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentials;
import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderHttpException;
import de.mathejungalt.matheportal.shell.test.InjectWireMock;
import de.mathejungalt.matheportal.shell.test.WireMockAuthprovider;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.put;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;

@QuarkusTest
@QuarkusTestResource(WireMockAuthprovider.class)
public class ExchangeAccessTokenForJwtDelegateTest {

    private static final String ACCESS_TOKEN = "hlsahhasokqhsauoh";

    private static final String URL = "/api/token/exchange/" + ACCESS_TOKEN + "/v2";

    @InjectWireMock
    WireMockServer wireMockServer;

    @Inject
    ExchangeAccessTokenForJwtDelegate delegate;

    OAuthClientCredentials credentials;

    @BeforeEach
    void setup() {
        credentials = OAuthClientCredentials.builder().nonce("test-nonce-123").build();
        wireMockServer.resetAll();
    }

    @Test
    void should_getTheJwt_returnTheExchangeTokenResponse_when_success() {
        // arrange

        final String expectedJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody(
                                        """
                                                {
                                                        "nonce": "test-nonce-123",
                                                        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
                                                    }
                                                }""")));

        // act
        final ExchangeTokenResponse result = delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN);

        // assert
        assertAll(() -> assertEquals(expectedJwt, result.getJwt()),
                () -> assertEquals("test-nonce-123", result.getNonce()));
    }

    @Test
    void should_throwAuthproviderHttpException_when401() {

        // arrange
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(401).withHeader("Content-Type", "application/json").withBody("""
                                            {"messagePayload":{"level":"ERROR","message":"Unauthorized"},"data":null}
                                        """)));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        // assert
        assertEquals(
                "Konfiguration des AuthproviderRestClient-Aufrufs ist falsch - client.id und client.secret prüfen.",
                exception.getMessage());
        assertEquals(401, exception.getStatus());
    }

    @Test
    void should_throwAuthproviderHttpException_whenConnectionReset() {
        wireMockServer.stubFor(put(urlEqualTo(URL)).willReturn(aResponse().withFault(Fault.CONNECTION_RESET_BY_PEER)));

        assertThrows(AuthproviderHttpException.class, () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));
    }

    @Test
    void should_throwAuthproviderHttpException_whenDataMapIncomplete_both_missing() {
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody(
                                        """
                                                    {
                                                                    "irgendeinKey": "test-nonce-123",
                                                                    "einAnderesAttribut": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
                                                                }
                                                """)));

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertEquals("IAM-Antwort hat das nonce geaendert: erwartetes nonce=test-nonce-123, aktuell=null",
                exception.getMessage());
        assertEquals(502, exception.getStatus());
    }

    @Test
    void should_throwAuthproviderHttpException_whenDataMapIncomplete_nonce_changed() {
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody(
                                        """
                                                    {
                                                                    "nonce": "nonce-987",
                                                                    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
                                                                }
                                                """)));

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertEquals("IAM-Antwort hat das nonce geaendert: erwartetes nonce=test-nonce-123, aktuell=nonce-987",
                exception.getMessage());
        assertEquals(502, exception.getStatus());
    }

    @Test
    void should_throwAuthproviderHttpException_whenDataMapIncomplete_nonce_missing() {
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody(
                                        """
                                                    {
                                                                    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
                                                                }
                                                """)));

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertEquals("IAM-Antwort hat das nonce geaendert: erwartetes nonce=test-nonce-123, aktuell=null",
                exception.getMessage());
        assertEquals(502, exception.getStatus());
    }

    @Test
    void should_throwAuthproviderHttpException_whenDataMapIncomplete_jwt_missing() {
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                            {
                                                            "nonce": "test-nonce-123"
                                                        }
                                        """)));

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: jwt fehlt", exception.getMessage());
        assertEquals(502, exception.getStatus());
    }

    @Test
    void should_throwAuthproviderHttpException_when_invalidJson() {

        // arrange
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("{ ungültiges json <<")));

        // act
        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        // assert
        assertEquals("IAM antwortet mit unerwarteter response payload beim Tausch des Tokens", exception.getMessage());
        assertEquals(502, exception.getStatus());

    }

    @Test
    void should_throwAuthproviderHttpException_whenNotJson() {
        // arrange
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
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
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertEquals("IAM antwortet mit unerwarteter response payload beim Tausch des Tokens", exception.getMessage());
        assertEquals(502, exception.getStatus());

    }

    @Test
    void should_throwAuthproviderHttpException_whenBodyNull() {
        // arrange
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                            null
                                        """)));

        final AuthproviderHttpException exception = assertThrows(AuthproviderHttpException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertEquals("IAM antwortet mit unerwarteter response payload 'null' beim Tausch des Tokens",
                exception.getMessage());
        assertEquals(502, exception.getStatus());

    }

}
