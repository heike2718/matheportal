package de.mathejungalt.matheportal.shell.domain.logout;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.matheportal.shell.domain.session.SessionCookieAdapter;

import static org.junit.jupiter.api.Assertions.assertAll;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LogoutServiceTest {

    @Mock
    SessionCookieAdapter sessionCookieAdapter;

    @Mock
    SessionFacade sessionFacade;

    @InjectMocks
    LogoutService logoutService;

    @Test
    void shouldInvalidateSessionWhenCookieExists() {

        // arrange
        final String sessionId = "session-id";

        when(sessionCookieAdapter.getSessionId()).thenReturn(Optional.of(sessionId));
        doNothing().when(sessionFacade).invalidateSession(sessionId);

        // act
        logoutService.logout();

        // assert
        assertAll(() -> verify(sessionCookieAdapter).getSessionId(),
                () -> verify(sessionFacade).invalidateSession(sessionId));
    }

    @Test
    void shouldIgnoreWhenCookieNotExists() {

        // arrange
        when(sessionCookieAdapter.getSessionId()).thenReturn(Optional.empty());

        // act
        logoutService.logout();

        // assert
        assertAll(() -> verify(sessionCookieAdapter).getSessionId(), () -> verify(sessionCookieAdapter).getSessionId(),
                () -> verifyNoInteractions(sessionFacade));
    }

}
