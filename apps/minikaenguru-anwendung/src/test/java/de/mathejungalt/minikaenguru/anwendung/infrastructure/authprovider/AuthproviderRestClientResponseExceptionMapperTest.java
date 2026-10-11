package de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider;

import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * AuthproviderRestClientResponseExceptionMapperTest.
 */
public class AuthproviderRestClientResponseExceptionMapperTest {

    private final AuthproviderRestClientResponseExceptionMapper exceptionMapper = new AuthproviderRestClientResponseExceptionMapper();

    @ParameterizedTest
    @CsvSource({ "503", "504" })
    void test_communication_problems(final int status) {

        // arrange
        final String expectedErrorMessage = "Authprovider kann nicht erreicht werden.";

        final Response response = Response.status(status).build();

        // act
        final AuthproviderHttpException exception = (AuthproviderHttpException) exceptionMapper.toThrowable(response);

        // assert
        assertEquals(status, exception.getStatus());
        assertEquals(expectedErrorMessage, exception.getMessage());

    }

    @Test
    void test_404() {

        // arrange
        final int status = 404;
        final String expectedErrorMessage = "Diese Resource gibt es nicht.";

        final Response response = Response.status(status).build();

        // act
        final AuthproviderHttpException exception = (AuthproviderHttpException) exceptionMapper.toThrowable(response);

        // assert
        assertEquals(status, exception.getStatus());
        assertEquals(expectedErrorMessage, exception.getMessage());

    }

    @Test
    void test_500_without_payload() {

        // arrange
        final int status = 500;
        final String expectedErrorMessage = "authprovider hat bei http-Status 500 keine vertragsgemaesse Fehlerantwort geliefert. Erwartet wurde MessagePayload. Die response payload war leer oder konnte nicht entsprechend deserialisiert werden.\n";

        final Response response = Response.status(status).build();

        // act
        final AuthproviderHttpException exception = (AuthproviderHttpException) exceptionMapper.toThrowable(response);

        // assert
        assertEquals(status, exception.getStatus());
        assertEquals(expectedErrorMessage, exception.getMessage());

    }
}
