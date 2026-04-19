package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;

import com.fasterxml.jackson.core.JsonParseException;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.http.Fault;

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
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;

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
    void shouldThrowOfTypeIAM_ERROR_RESPONSE_when401() {

        // arrange
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(
                                aResponse().withStatus(401).withHeader("Content-Type", "application/json").withBody("""
                                            {"messagePayload":{"level":"ERROR","message":"Unauthorized"},"data":null}
                                        """)));

        // act
        final IamClientException exception = assertThrows(IamClientException.class,
                        () -> initAccessTokenDelegate.authenticateClient(credentials));

        // assert
        assertAll(() -> assertEquals(IamClientErrorType.IAM_ERROR_RESPONSE, exception.getErrorType()),
            () -> assertEquals("IAM antwortet mit Status 401 - Unauthorized", exception.getMessage()),
            () -> assertInstanceOf(WebApplicationException.class, exception.getCause()));
    }

    @Test
    void shouldThrowIamUnreachableException_whenConnectionReset() {
        wireMockServer.stubFor(post(urlEqualTo(URL)).willReturn(aResponse().withFault(Fault.CONNECTION_RESET_BY_PEER)));

        assertThrows(IamUnreachableException.class, () -> initAccessTokenDelegate.authenticateClient(credentials));
    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_whenDataMapIncomplete_both_missing() {
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

        final IamClientException exception = assertThrows(IamClientException.class,
                        () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                () -> assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder accessToken fehlen",
                        exception.getMessage()),
                    () -> assertNull(exception.getCause()));
    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_whenDataMapIncomplete_nonce_missing() {
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

        final IamClientException exception = assertThrows(IamClientException.class,
                        () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                () -> assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder accessToken fehlen",
                        exception.getMessage()),
                    () -> assertNull(exception.getCause()));

    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_whenDataMapIncomplete_accessToken_missing() {
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

        final IamClientException exception = assertThrows(IamClientException.class,
                        () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                () -> assertEquals("IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder accessToken fehlen",
                        exception.getMessage()),
                    () -> assertNull(exception.getCause()));

    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_when_invalidJson() {
        wireMockServer
                .stubFor(post(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("{ ungültiges json <<")));

        final IamClientException exception = assertThrows(IamClientException.class,
                        () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                        () -> assertEquals("IAM-Antwort ist invalides json", exception.getMessage()),
                () -> assertInstanceOf(JsonParseException.class, exception.getCause()));

    }

    @Test
    void shouldThrowOfTypeIAM_CONTRACT_VIOLATION_whenNotJson() {
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

        final IamClientException exception = assertThrows(IamClientException.class,
                        () -> initAccessTokenDelegate.authenticateClient(credentials));

        assertAll(() -> assertEquals(IamClientErrorType.IAM_CONTRACT_VIOLATION, exception.getErrorType()),
                () -> assertEquals("IAM-Antwort kann nicht deserialisiert werden - wahrscheinlich falscher MIME-Type)", exception.getMessage()),
                () -> assertInstanceOf(ProcessingException.class, exception.getCause()));

        
    }
}
