package de.mathejungalt.matheportal.shell.domain.session;

import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.authsessions.api.AuthenticatedUser;
import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.authsessions.api.SessionValidationFailedReason;
import de.mathejungalt.authsessions.api.UserDto;
import de.mathejungalt.authsessions.api.exceptions.SessionValidationFailedException;

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
     * @throws SessionValidationFailedException wenn es kein Session-Cookie gibt oder die Session nicht mehr vorhanden
     *                                          oder endgültig abgelaufen ist.
     */
    public UserDto reloadSession() throws SessionValidationFailedException {

        final Optional<String> optSessionId = sessionCookieAdapter.getSessionId();

        if (optSessionId.isEmpty()) {
            throw new SessionValidationFailedException(SessionValidationFailedReason.MISSING);
        }

        final String sessionId = optSessionId.get();

        try {
            final SessionDto sessionDto = sessionFacade
                    .reloadSession(sessionId, sessionIdleTimeoutMinutes, maxLifetimeMinutes);

            final AuthenticatedUser authenticatedUser = sessionDto.getAuthenticatedUser();

            return new UserDto(authenticatedUser.getFullName(), authenticatedUser.getRoles());
        } catch (final SessionValidationFailedException e) {
            // muss außerhalb der reloadSession-Transaction passieren, sonst ist die session
            // anschließend noch da.
            if (e.getReason() == SessionValidationFailedReason.EXPIRED) {
                this.sessionFacade.invalidateSessionQuietly(sessionId);
            }
            throw e;
        }
    }
}
