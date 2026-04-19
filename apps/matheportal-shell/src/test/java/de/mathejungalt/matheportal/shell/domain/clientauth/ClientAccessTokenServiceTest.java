package de.mathejungalt.matheportal.shell.domain.clientauth;

import java.util.Arrays;
import java.util.stream.Stream;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

import de.mathejungalt.matheportal.shell.domain.exception.IamClientException;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
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
    void shouldThrowSECURITY_VIOLATION_whenNonceMismatch() {

        // arrange
        when(clientCredentialsProvider.getClientCredentials("test-nonce"))
                .thenReturn(OAuthClientCredentials.builder().build());
        when(initAccessTokenDelegate.authenticateClient(any(OAuthClientCredentials.class)))
                .thenReturn(new OauthClientAccessToken("anderes-nonce", "test-access-token"));

        // act + assert
        final IamClientException exeption = assertThrows(IamClientException.class,
                () -> clientAccessTokenService.orderAccessToken("test-nonce"));

        assertAll(() -> assertEquals(IamClientErrorType.SECURITY_VIOLATION, exeption.getErrorType()),
                () -> verify(clientCredentialsProvider).getClientCredentials(anyString()),
                () -> verify(initAccessTokenDelegate).authenticateClient(any(OAuthClientCredentials.class)));
    }

    @ParameterizedTest
    @MethodSource("getIamErrorTypes")
    void shouldPropagateIamClientException(final IamClientErrorType errorType) {

        // arrange
        final IamClientException iamClientException = new IamClientException("message", new RuntimeException(),
                errorType);
        when(clientCredentialsProvider.getClientCredentials("test-nonce"))
                .thenReturn(OAuthClientCredentials.builder().build());
        when(initAccessTokenDelegate.authenticateClient(any(OAuthClientCredentials.class)))
                .thenThrow(iamClientException);

        // act + assert
        final IamClientException exeption = assertThrows(IamClientException.class,
                () -> clientAccessTokenService.orderAccessToken("test-nonce"));

        assertAll(() -> assertEquals(errorType, exeption.getErrorType()),
                () -> assertEquals("message", exeption.getMessage()),
                () -> assertInstanceOf(RuntimeException.class, exeption.getCause()),
                () -> verify(clientCredentialsProvider).getClientCredentials(anyString()),
                () -> verify(initAccessTokenDelegate).authenticateClient(any(OAuthClientCredentials.class)));

    }

    private static Stream<IamClientErrorType> getIamErrorTypes() {

        return Arrays
                .stream(IamClientErrorType.values())
                .filter(t -> IamClientErrorType.IAM_CONTRACT_VIOLATION == t
                        || IamClientErrorType.IAM_ERROR_RESPONSE == t);

    }

}
