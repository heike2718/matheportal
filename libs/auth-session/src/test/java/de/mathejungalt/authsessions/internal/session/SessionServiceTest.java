package de.mathejungalt.authsessions.internal.session;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import de.mathejungalt.authsessions.api.AuthenticatedUser;
import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.internal.session.entities.SessionEntity;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @InjectMocks
    SessionService sessionService;

    @Mock
    SessionRepository sessionRepository;

    @Mock
    Clock clock;

    @Test
    void should_create_and_persist_a_session() {

        // arrange

        final String uuid = UUID.randomUUID().toString();

        final AuthenticatedUser user = AuthenticatedUser
                .builder()
                .uuid(uuid)
                .fullName("Flotte Lotte")
                .roles(Set.of("STANDARD"))
                .build();

        when(clock.getZone()).thenReturn(ZoneId.of("Europe/Berlin"));
        when(clock.instant()).thenReturn(Instant.parse("2026-04-08T10:15:30Z"));

        doNothing().when(sessionRepository).saveSession(any(SessionEntity.class));

        // act
        final SessionDto sessionDto = sessionService.createSession(user, 0);

        // assert
        assertAll(() -> assertNotNull(sessionDto), () -> assertNotNull(sessionDto.getUser()),
                () -> assertEquals("Flotte Lotte", sessionDto.getUser().fullName()),
                () -> assertEquals("STANDARD", sessionDto.getUser().roles().iterator().next()),
                () -> assertNotNull(sessionDto.getSessionId()));

        verify(sessionRepository).saveSession(any(SessionEntity.class));
        verify(clock).getZone();
        verify(clock).instant();

    }

}
