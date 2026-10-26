package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

import de.mathejungalt.matheportal.shell.domain.generated.ErrorResponse;
import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderHttpException;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
class AuthproviderHttpExceptionMapperTest {

    private static final String EXPECTED_MESSAGE = """
            Login oder Anlegen eines Benutzerkontos sind zur Zeit leider \
            nicht möglich. Bitte senden Sie eine Mail und versuchen es \
            später noch einmal.\
            """;

    @Test
    void should_return_return_the_status() {

        // arrange
        final AuthproviderHttpException exception = new AuthproviderHttpException(400, "irgendeine message");

        // act
        final Response response = new AuthproviderHttpExceptionMapper().toResponse(exception);

        // assert

        final ErrorResponse errorResponse = response.readEntity(ErrorResponse.class);

        assertAll(() -> assertEquals(400, response.getStatus()),
                () -> assertEquals(EXPECTED_MESSAGE, errorResponse.getMessage()));

    }

}
