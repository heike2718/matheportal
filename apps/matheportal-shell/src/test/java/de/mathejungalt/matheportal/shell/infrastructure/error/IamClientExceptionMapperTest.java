package de.mathejungalt.matheportal.shell.infrastructure.error;

import java.util.Arrays;
import java.util.stream.Stream;

import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import io.quarkus.test.junit.QuarkusTest;

import de.mathejungalt.matheportal.shell.domain.clientauth.IamClientErrorType;
import de.mathejungalt.matheportal.shell.domain.exception.IamClientException;
import de.mathejungalt.matheportal.shell.domain.exception.IamUnreachableException;
import de.mathejungalt.matheportal.shell.domain.generated.ErrorResponse;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
public class IamClientExceptionMapperTest {

    private static final String EXPECTED_MESSAGE = """
            Login oder Anlegen eines Benutzerkontos sind zur Zeit leider \
            nicht möglich. Bitte senden Sie eine Mail und versuchen es \
            später noch einmal.\
            """;

    @Test
    void should_return_503_when_iamUnreachable() {

        // arrange
        final IamClientException exception = new IamUnreachableException("irgendeine message", null);

        // act
        final Response response = new IamClientExceptionMapper().toResponse(exception);

        // assert

        final ErrorResponse errorResponse = response.readEntity(ErrorResponse.class);

        assertAll(() -> assertEquals(503, response.getStatus()),
                () -> assertEquals(EXPECTED_MESSAGE, errorResponse.getMessage()));

    }

    @ParameterizedTest
    @MethodSource("getExceptionTypes500")
    void should_return_500_when_otherCause(final IamClientErrorType errorType) {

        // arrange
        final IamClientException exception = new IamClientException("irgendeine message", errorType);

        // act
        final Response response = new IamClientExceptionMapper().toResponse(exception);

        // assert

        final ErrorResponse errorResponse = response.readEntity(ErrorResponse.class);

        assertAll(() -> assertEquals(500, response.getStatus()),
                () -> assertEquals(EXPECTED_MESSAGE, errorResponse.getMessage()));

    }

    private static Stream<IamClientErrorType> getExceptionTypes500() {

        return Arrays.stream(IamClientErrorType.values()).filter(t -> IamClientErrorType.IAM_UNREACHABLE != t);

    }

}
