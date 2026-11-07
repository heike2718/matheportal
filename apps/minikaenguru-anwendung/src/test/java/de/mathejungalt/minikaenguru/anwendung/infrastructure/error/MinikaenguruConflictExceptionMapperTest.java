package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Test;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * MinikaenguruConflictExceptionMapperTest.
 */
public class MinikaenguruConflictExceptionMapperTest {

    @Test
    void should_create_status409_and_ErrorResponse_with_message_fromException() {

        // arrange
        final MinikaenguruConflictException exception = new MinikaenguruConflictException(
                "diese Message soll ins ErrorResponse");

        // act
        try (final Response response = new MinikaenguruConflictExceptionMapper().toResponse(exception)) {
            // assert
            final ErrorResponse errorResponse = response.readEntity(ErrorResponse.class);

            assertAll(() -> assertEquals(409, response.getStatus()),
                    () -> assertEquals("diese Message soll ins ErrorResponse", errorResponse.getMessage()));
        }

    }

}
