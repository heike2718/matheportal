package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Test;

import de.mathejungalt.minikaenguru.anwendung.domain.authorization.MinikaenguruAuthorizationException;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

/**
 * MinikaenguruAuthorizationExceptionMapperTest.
 */
public class MinikaenguruAuthorizationExceptionMapperTest {

    @Test
    void should_create_status403_withEmptyBody() {

        // arrange
        final MinikaenguruAuthorizationException exception = new MinikaenguruAuthorizationException(
                "diese Message soll ins ErrorResponse");

        // act
        try (final Response response = new MinikaenguruAuthorizationExceptionMapper().toResponse(exception)) {

            // assert
            assertAll(() -> assertEquals(403, response.getStatus()), () -> assertNull(response.getEntity()));
        }

    }

}
