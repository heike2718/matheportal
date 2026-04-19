package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

import de.mathejungalt.matheportal.shell.domain.clientauth.ClientAccessTokenService;
import de.mathejungalt.matheportal.shell.domain.clientauth.IamClientErrorType;
import de.mathejungalt.matheportal.shell.domain.exception.IamClientException;
import de.mathejungalt.matheportal.shell.domain.exception.IamUnreachableException;

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
        final UrlResponse result = service.getLoginUrl();

        // assert
        assertAll(() -> assertEquals(
                "http://localhost:9000/authprovider/login?accessToken=abc123&state=login&redirectUrl=http://localhost:4200",
                result.getUrl()), () -> verify(clientAccessTokenService).orderAccessToken(anyString()));

    }

    @Test
    void should_getLoginUrl_propagateIamClientException() {

        // arrange
        when(clientAccessTokenService.orderAccessToken(anyString()))
                .thenThrow(new IamClientException(("IAM antwortet mit Fehlercode"), null,
                        IamClientErrorType.IAM_CONTRACT_VIOLATION));

        // act + assert
        assertAll(() -> assertThrows(IamClientException.class, () -> service.getLoginUrl()),
                () -> verify(clientAccessTokenService).orderAccessToken(anyString()));

    }

    @Test
    void should_getLoginUrl_propagateIamUnreachableException() {

        // arrange
        when(clientAccessTokenService.orderAccessToken(anyString()))
                .thenThrow(new IamUnreachableException(("IAM antwortet mit Fehlercode"), null));

        // act + assert
        assertAll(() -> assertThrows(IamUnreachableException.class, () -> service.getLoginUrl()),
                () -> verify(clientAccessTokenService).orderAccessToken(anyString()));

    }
}
