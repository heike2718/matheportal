package de.mathejungalt.matheportal.shell.domain.clientauth;

import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import de.mathejungalt.matheportal.shell.domain.exception.ClientAuthException;
import de.mathejungalt.matheportal.shell.domain.exception.IamResponseException;
import de.mathejungalt.matheportal.shell.domain.exception.RestCommunicationFailedException;
import de.mathejungalt.matheportal.shell.domain.exception.RestResponseProcessingException;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class ClientAccessTokenServiceTest {

    @InjectMock
    InitAccessTokenDelegate initAccessTokenDelegate;

    @InjectMock
    OAuthClientCredentialsProvider clientCredentialsProvider;

    @Inject
    ClientAccessTokenService clientAccessTokenService;

    @Test
    void shouldReturnAccessToken_whenNonceMatches() {

        // arrange
        when(clientCredentialsProvider.getClientCredentials("test-nonce"))
                .thenReturn(OAuthClientCredentials.builder().build());
        when(initAccessTokenDelegate.authenticateClient(any(OAuthClientCredentials.class)))
                .thenReturn(new OauthClientAccessToken("test-nonce", "test-access-token"));

        // act
        final String result = clientAccessTokenService.orderAccessToken("test-nonce");

        // assert
        assertAll(() -> assertEquals("test-access-token", result),
                () -> verify(clientCredentialsProvider).getClientCredentials(anyString()),
                () -> verify(initAccessTokenDelegate).authenticateClient(any(OAuthClientCredentials.class)));
        ;
    }

    @Test
    void shouldThrowClientAuthException_whenNonceMismatch() {

        // arrange
        when(clientCredentialsProvider.getClientCredentials("test-nonce"))
                .thenReturn(OAuthClientCredentials.builder().build());
        when(initAccessTokenDelegate.authenticateClient(any(OAuthClientCredentials.class)))
                .thenReturn(new OauthClientAccessToken("anderes-nonce", "test-access-token"));

        // act + assert
        assertAll(
                () -> assertThrows(ClientAuthException.class,
                        () -> clientAccessTokenService.orderAccessToken("test-nonce")),
                () -> verify(clientCredentialsProvider).getClientCredentials(anyString()),
                () -> verify(initAccessTokenDelegate).authenticateClient(any(OAuthClientCredentials.class)));
    }

    @Test
    void shouldPropagateIamResponseException() {

        // arrange
        when(clientCredentialsProvider.getClientCredentials(anyString()))
                .thenReturn(OAuthClientCredentials.builder().build());
        when(initAccessTokenDelegate.authenticateClient(any(OAuthClientCredentials.class)))
                .thenThrow(new IamResponseException("IAM antwortete mit Status 401", 401, null));

        // act + assert
        assertAll(
                () -> assertThrows(IamResponseException.class,
                        () -> clientAccessTokenService.orderAccessToken("test-nonce")),
                () -> verify(clientCredentialsProvider).getClientCredentials(anyString()),
                () -> verify(initAccessTokenDelegate).authenticateClient(any(OAuthClientCredentials.class)));
    }

    @Test
    void shouldPropagateRestResponseProcessingException() {

        // arrange
        when(clientCredentialsProvider.getClientCredentials(anyString()))
                .thenReturn(OAuthClientCredentials.builder().build());
        when(initAccessTokenDelegate.authenticateClient(any(OAuthClientCredentials.class)))
                .thenThrow(new RestResponseProcessingException("invalides JSON", new RuntimeException()));

        // act + assert

        assertAll(
                () -> assertThrows(RestResponseProcessingException.class,
                        () -> clientAccessTokenService.orderAccessToken("test-nonce")),
                () -> verify(clientCredentialsProvider).getClientCredentials(anyString()),
                () -> verify(initAccessTokenDelegate).authenticateClient(any(OAuthClientCredentials.class)));
    }

    @Test
    void shouldPropagateRestCommunicationFailedException() {

        // arrange
        when(clientCredentialsProvider.getClientCredentials(anyString()))
                .thenReturn(OAuthClientCredentials.builder().build());
        when(initAccessTokenDelegate.authenticateClient(any(OAuthClientCredentials.class)))
                .thenThrow(new RestCommunicationFailedException("Kommunikationsfehler", new RuntimeException()));

        // act + assert

        assertAll(
                () -> assertThrows(RestCommunicationFailedException.class,
                        () -> clientAccessTokenService.orderAccessToken("test-nonce")),
                () -> verify(clientCredentialsProvider).getClientCredentials(anyString()),
                () -> verify(initAccessTokenDelegate).authenticateClient(any(OAuthClientCredentials.class)));
    }
}
