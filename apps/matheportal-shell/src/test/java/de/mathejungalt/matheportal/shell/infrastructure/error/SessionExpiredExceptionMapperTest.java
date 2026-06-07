package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import de.mathejungalt.authsessions.api.SessionValidationFailedDto;
import de.mathejungalt.authsessions.api.SessionValidationFailedReason;
import de.mathejungalt.authsessions.api.exceptions.SessionValidationFailedException;
import de.mathejungalt.matheportal.shell.domain.session.SessionCookieAdapter;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SessionExpiredExceptionMapperTest {

    @InjectMocks
    SessionExpiredExceptionMapper exceptionMapper;

    @Mock
    SessionCookieAdapter sessionCookieAdapter;

    @Test
    void should_response_contain_payload_and_cookie() {

        // arrange
        when(sessionCookieAdapter.createExpiredSessionCookie()).thenReturn(getCookie());

        // act
        try (Response response = exceptionMapper
                .toResponse(new SessionValidationFailedException(SessionValidationFailedReason.EXPIRED))) {
            // assert
            final SessionValidationFailedDto entity = response.readEntity(SessionValidationFailedDto.class);

            assertAll(() -> assertEquals(401, response.getStatus()),
                    () -> assertTrue(response.getCookies().containsKey("MPSESSIONID")),
                    () -> assertEquals(SessionValidationFailedReason.EXPIRED, entity.reason()),
                    () -> verify(sessionCookieAdapter).createExpiredSessionCookie());
        }

    }

    private NewCookie getCookie() {
        return new NewCookie.Builder("MPSESSIONID")
                .value("")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .sameSite(NewCookie.SameSite.LAX)
                .build();
    }
}
