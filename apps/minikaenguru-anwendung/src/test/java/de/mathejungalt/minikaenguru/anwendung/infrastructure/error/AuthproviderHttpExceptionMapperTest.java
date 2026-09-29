package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import jakarta.ws.rs.core.Response;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderHttpException;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * AuthproviderHttpExceptionMapperTest
 */
public class AuthproviderHttpExceptionMapperTest {

    private final AuthproviderHttpExceptionMapper exceptionMapper = new AuthproviderHttpExceptionMapper();

    @ParameterizedTest
    @CsvSource({ "400", "401", "403", "404", "405", "408", "429", "500", "502", "503", "504" })
    void should_return_general_errorMessage(final int status) {

        final String expectedMessage = "Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.";

        final AuthproviderHttpException exception = new AuthproviderHttpException(status, "andere Fehlermeldung");

        // act
        final Response response = exceptionMapper.toResponse(exception);

        final ErrorResponse errorResponse = response.readEntity(ErrorResponse.class);

        assertEquals(500, response.getStatus());
        assertEquals(expectedMessage, errorResponse.getMessage());

    }
}
