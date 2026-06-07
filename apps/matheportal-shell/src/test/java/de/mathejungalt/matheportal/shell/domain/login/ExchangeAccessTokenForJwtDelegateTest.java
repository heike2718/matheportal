package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.http.Fault;

import de.mathejungalt.matheportal.shell.domain.clientauth.IamClientErrorType;
import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentials;
import de.mathejungalt.matheportal.shell.domain.exception.IamClientException;
import de.mathejungalt.matheportal.shell.domain.exception.IamUnreachableException;
import de.mathejungalt.matheportal.shell.test.InjectWireMock;
import de.mathejungalt.matheportal.shell.test.WireMockAuthprovider;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.put;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;

@QuarkusTest
@QuarkusTestResource(WireMockAuthprovider.class)
public class ExchangeAccessTokenForJwtDelegateTest {

    private static final String ACCESS_TOKEN = "hlsahhasokqhsauoh";

    private static final String URL = "/api/token/exchange/" + ACCESS_TOKEN;

    @InjectWireMock
    WireMockServer wireMockServer;

    @Inject
    ExchangeAccessTokenForJwtDelegate delegate;

    OAuthClientCredentials credentials;

    @BeforeEach
    void setup() {
        credentials = OAuthClientCredentials.builder().build();
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
                                                        "messagePayload": {"level":"INFO","message":"ok"},
                                                        "data": {
                                                            "nonce": "test-nonce-123",
                                                            "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
                                                        }
                                                    }
                                                """)));

        // act
        final ExchangeTokenResponse result = delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN);

        // assert
        assertAll(() -> assertEquals(expectedJwt, result.getJwt()),
                () -> assertEquals("test-nonce-123", result.getNonce()));
    }

    @Test
    void shouldThrowOfTypeIAM_ERROR_RESPONSE_when401() {

        // arrange
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(401).withHeader("Content-Type", "application/json").withBody("""
                                            {"messagePayload":{"level":"ERROR","message":"Unauthorized"},"data":null}
                                        """)));

        // act
        final IamClientException exception = assertThrows(IamClientException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        // assert
        assertAll(() -> assertEquals(IamClientErrorType.IAM_ERROR_RESPONSE, exception.getErrorType()),
                () -> assertEquals("IAM antwortet mit Status 401 - Unauthorized", exception.getMessage()),
                () -> assertInstanceOf(WebApplicationException.class, exception.getCause()));
    }

    @Test
    void shouldThrowIamUnreachableException_whenConnectionReset() {
        wireMockServer.stubFor(put(urlEqualTo(URL)).willReturn(aResponse().withFault(Fault.CONNECTION_RESET_BY_PEER)));

        assertThrows(IamUnreachableException.class, () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));
    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_whenDataMapIncomplete_both_missing() {
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                            {
                                                "messagePayload": {"level":"INFO","message":"ok"},
                                                "data": {
                                                    "someOtherKey": "someValue"
                                                }
                                            }
                                        """)));

        final IamClientException exception = assertThrows(IamClientException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                () -> assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder jwt fehlen",
                        exception.getMessage()),
                () -> assertNull(exception.getCause()));
    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_whenDataMapIncomplete_nonce_missing() {
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                            {
                                                "messagePayload": {"level":"INFO","message":"ok"},
                                                "data": {
                                                    "someOtherKey": "someValue",
                                                    "jwt": "eyZoadlwidgwo"
                                                }
                                            }
                                        """)));

        final IamClientException exception = assertThrows(IamClientException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                () -> assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder jwt fehlen",
                        exception.getMessage()),
                () -> assertNull(exception.getCause()));
    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_whenDataMapIncomplete_jwt_missing() {
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody("""
                                            {
                                                "messagePayload": {"level":"INFO","message":"ok"},
                                                "data": {
                                                    "someOtherKey": "someValue",
                                                    "nonce": "test-nonce"
                                                }
                                            }
                                        """)));

        final IamClientException exception = assertThrows(IamClientException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                () -> assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder jwt fehlen",
                        exception.getMessage()),
                () -> assertNull(exception.getCause()));
    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_when_invalidJson() {

        // arrange
        wireMockServer
                .stubFor(put(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("{ ungültiges json <<")));

        // act
        final IamClientException exception = assertThrows(IamClientException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        // assert
        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                () -> assertEquals("IAM-Antwort ist invalides json", exception.getMessage()),
                () -> assertInstanceOf(WebApplicationException.class, exception.getCause()));

    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_whenNotJson() {
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

        final IamClientException exception = assertThrows(IamClientException.class,
                () -> delegate.exchangeTheAccessToken(credentials, ACCESS_TOKEN));

        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                () -> assertEquals("IAM-Antwort kann nicht deserialisiert werden - wahrscheinlich falscher MIME-Type)",
                        exception.getMessage()),
                () -> assertInstanceOf(ProcessingException.class, exception.getCause()));

    }

}
