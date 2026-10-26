package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderHttpException;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
    void should_throwAuthproviderHttpException_whenNonceMismatch() {

        // arrange
        when(clientCredentialsProvider.getClientCredentials("test-nonce"))
                .thenReturn(OAuthClientCredentials.builder().build());
        when(initAccessTokenDelegate.authenticateClient(any(OAuthClientCredentials.class)))
                .thenReturn(new OauthClientAccessToken("anderes-nonce", "test-access-token"));

        // act + assert
        final AuthproviderHttpException exeption = assertThrows(AuthproviderHttpException.class,
                () -> clientAccessTokenService.orderAccessToken("test-nonce"));

        assertAll(() -> assertEquals(502, exeption.getStatus()),
                () -> verify(clientCredentialsProvider).getClientCredentials(anyString()),
                () -> verify(initAccessTokenDelegate).authenticateClient(any(OAuthClientCredentials.class)));
    }

    @Test
    void shouldPropagateAuthproviderHttpException() {

        // arrange
        final AuthproviderHttpException iamClientException = new AuthproviderHttpException(502, "eine Fehlermeldung");
        when(clientCredentialsProvider.getClientCredentials("test-nonce"))
                .thenReturn(OAuthClientCredentials.builder().build());
        when(initAccessTokenDelegate.authenticateClient(any(OAuthClientCredentials.class)))
                .thenThrow(iamClientException);

        // act + assert
        final AuthproviderHttpException exeption = assertThrows(AuthproviderHttpException.class,
                () -> clientAccessTokenService.orderAccessToken("test-nonce"));

        assertAll(() -> assertEquals(502, exeption.getStatus()),
                () -> assertEquals("eine Fehlermeldung", exeption.getMessage()),
                () -> verify(clientCredentialsProvider).getClientCredentials(anyString()),
                () -> verify(initAccessTokenDelegate).authenticateClient(any(OAuthClientCredentials.class)));

    }

}
