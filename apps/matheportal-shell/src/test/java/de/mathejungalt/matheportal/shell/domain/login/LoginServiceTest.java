package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.authsessions.api.AuthenticatedUser;
import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentials;
import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentialsProvider;
import de.mathejungalt.matheportal.shell.domain.restclientutils.NonceGenerator;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
public class LoginServiceTest {

    @ConfigProperty(name = "session.idle.timeout")
    int sessionIdleTimeoutMinutes;

    @InjectMock
    NonceGenerator nonceGenerator;

    @InjectMock
    ExchangeAccessTokenForJwtDelegate exchangeAccessTokenForJwtDelegate;

    @InjectMock
    OAuthClientCredentialsProvider clientCredentialsProvider;

    @InjectMock
    SessionFacade sessionFacade;

    @Inject
    LoginService loginService;

    @Test
    void should_return_SessionDto_whenOK() {

        // arrange
        final String nonce = "test-nonce-123";
        final String jwt = "eyzuiqdi";
        final String accessToken = "test.accessToken-123";
        final String uuid = "test-uuid";
        final ExchangeTokenResponse exchangeTokenResponse = ExchangeTokenResponse
                .builder()
                .nonce(nonce)
                .jwt(jwt)
                .build();

        final String sessionId = "test-sessionId";
        final AuthenticatedUser authenticatedUser = AuthenticatedUser.builder().uuid(uuid).build();

        final OAuthClientCredentials clientCredentials = OAuthClientCredentials.builder().nonce(nonce).build();
        final SessionDto sessionDto = SessionDto
                .builder()
                .authenticatedUser(authenticatedUser)
                .sessionId(sessionId)
                .build();

        when(nonceGenerator.generateNonce()).thenReturn(nonce);
        when(clientCredentialsProvider.getClientCredentials(anyString())).thenReturn(clientCredentials);
        when(exchangeAccessTokenForJwtDelegate.exchangeTheAccessToken(any(OAuthClientCredentials.class), anyString()))
                .thenReturn(exchangeTokenResponse);
        when(sessionFacade.createSession(jwt, sessionIdleTimeoutMinutes)).thenReturn(sessionDto);

        // act
        final SessionDto result = loginService.login(accessToken);

        // assert

        assertAll(() -> assertEquals(sessionId, result.getSessionId()),
                () -> assertNotNull(result.getAuthenticatedUser()),
                () -> assertEquals(uuid, result.getAuthenticatedUser().getUuid()),
                () -> verify(nonceGenerator).generateNonce(),
                () -> verify(clientCredentialsProvider).getClientCredentials(nonce),
                () -> verify(exchangeAccessTokenForJwtDelegate)
                        .exchangeTheAccessToken(any(OAuthClientCredentials.class), anyString()),
                () -> verify(sessionFacade).createSession(jwt, sessionIdleTimeoutMinutes));
    }

}
