package de.mathejungalt.matheportal.shell.domain.session;

import java.util.Optional;
import java.util.Set;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.authsessions.api.AuthenticatedUser;
import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.authsessions.api.UserDto;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
public class ReloadSessionServiceTest {

    @ConfigProperty(name = "session.idle.timeout")
    int sessionIdleTimeoutMinutes;

    @ConfigProperty(name = "session.max.lifetime")
    int maxLifetimeMinutes;

    @Inject
    ReloadSessionService reloadSessionService;

    @InjectMock
    SessionCookieAdapter sessionCookieAdapter;

    @InjectMock
    SessionFacade sessionFacade;

    @Test
    void should_returnTheUser_when_sessionExists_and_not_Expired() {

        // arrange
        final String sessionId = "session-id";

        final AuthenticatedUser authenticatedUser = AuthenticatedUser
                .builder()
                .fullName("Konfetti Paletti")
                .roles(Set.of("ADMIN"))
                .build();

        final SessionDto sessionDto = SessionDto
                .builder()
                .authenticatedUser(authenticatedUser)
                .sessionId(sessionId)
                .build();

        when(sessionCookieAdapter.getSessionId()).thenReturn(Optional.of(sessionId));
        when(sessionFacade.reloadSession(sessionId, sessionIdleTimeoutMinutes, maxLifetimeMinutes))
                .thenReturn(sessionDto);

        // act
        final UserDto result = reloadSessionService.reloadSession();

        // assert
        assertAll(() -> assertNotNull(result), () -> assertEquals("Konfetti Paletti", result.fullName()),
                () -> assertEquals(1, result.roles().size()),
                () -> assertEquals("ADMIN", result.roles().iterator().next()),
                () -> verify(sessionCookieAdapter).getSessionId(),
                () -> verify(sessionFacade).reloadSession(sessionId, sessionIdleTimeoutMinutes, maxLifetimeMinutes));
    }

}
