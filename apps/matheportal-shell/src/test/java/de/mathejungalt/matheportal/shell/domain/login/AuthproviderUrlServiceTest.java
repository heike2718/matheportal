package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

import de.mathejungalt.matheportal.shell.domain.clientauth.ClientAccessTokenService;
import de.mathejungalt.matheportal.shell.domain.generated.AuthUrlResponse;
import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderHttpException;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
public class AuthproviderUrlServiceTest {

    @Inject
    AuthproviderUrlService service;

    @InjectMock
    ClientAccessTokenService clientAccessTokenService;

    @Test
    void should_getLoginUrl_returnTheUrl() {

        // arrange
        final String accessToken = "abc123";
        when(clientAccessTokenService.orderAccessToken(anyString())).thenReturn(accessToken);

        // act
        final AuthUrlResponse result = service.getLoginUrl();

        // assert
        assertAll(() -> assertEquals(
                "http://localhost:9000/authprovider/login?accessToken=abc123&state=login&redirectUrl=http://localhost:9100/matheportal/",
                result.getUrl()), () -> verify(clientAccessTokenService).orderAccessToken(anyString()));

    }

    @Test
    void should_getLoginUrl_propagateAuthproviderHttpException() {

        // arrange
        when(clientAccessTokenService.orderAccessToken(anyString()))
                .thenThrow(new AuthproviderHttpException(400, "IAM antwortet mit Fehlercode"));

        // act + assert
        assertAll(() -> assertThrows(AuthproviderHttpException.class, () -> service.getLoginUrl()),
                () -> verify(clientAccessTokenService).orderAccessToken(anyString()));

    }

    @Test
    void should_getSignupUrl_returnTheUrl() {

        // arrange
        final String accessToken = "abc123";
        when(clientAccessTokenService.orderAccessToken(anyString())).thenReturn(accessToken);

        // act
        final AuthUrlResponse result = service.getSignupUrl();

        // assert
        assertAll(() -> assertEquals(
                "http://localhost:9000/authprovider/signup?accessToken=abc123&state=signup&redirectUrl=http://localhost:9100/matheportal/",
                result.getUrl()), () -> verify(clientAccessTokenService).orderAccessToken(anyString()));

    }

    @Test
    void should_getsignupUrl_propagateAuthproviderHttpException() {

        // arrange
        when(clientAccessTokenService.orderAccessToken(anyString()))
                .thenThrow(new AuthproviderHttpException(400, "IAM antwortet mit Fehlercode"));

        // act + assert
        assertAll(() -> assertThrows(AuthproviderHttpException.class, () -> service.getSignupUrl()),
                () -> verify(clientAccessTokenService).orderAccessToken(anyString()));

    }
}
