package de.mathejungalt.matheportal.shell.domain.session;

import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.authsessions.api.AuthenticatedUser;
import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.authsessions.api.UserDto;
import de.mathejungalt.authsessions.api.exceptions.SessionExpiredException;

import lombok.extern.slf4j.Slf4j;

/**
 * ReloadSessionService.
 */
@ApplicationScoped
@Slf4j
public class ReloadSessionService {

    @ConfigProperty(name = "session.idle.timeout")
    int sessionIdleTimeoutMinutes;

    @ConfigProperty(name = "session.max.lifetime")
    int maxLifetimeMinutes;

    @Inject
    SessionCookieAdapter sessionCookieAdapter;

    @Inject
    SessionFacade sessionFacade;

    /**
     * Läd die Session neu, wenn sie noch vorhanden und nicht zu alt ist.
     *
     * @return UserDto
     * @throws SessionExpiredException wenn es kein Session-Cookie gibt oder die Session nicht mehr vorhanden oder
     *                                 endgültig abgelaufen ist.
     */
    public UserDto reloadSession() throws SessionExpiredException {

        final Optional<String> optSessionId = sessionCookieAdapter.getSessionId();

        if (optSessionId.isEmpty()) {
            throw new SessionExpiredException("kein oder leeres Session-Cookie");
        }

        final String sessionId = optSessionId.get();

        final SessionDto sessionDto = sessionFacade
                .reloadSession(sessionId, sessionIdleTimeoutMinutes, maxLifetimeMinutes);

        final AuthenticatedUser authenticatedUser = sessionDto.getAuthenticatedUser();

        return new UserDto(authenticatedUser.getFullName(), authenticatedUser.getRoles());
    }
}
