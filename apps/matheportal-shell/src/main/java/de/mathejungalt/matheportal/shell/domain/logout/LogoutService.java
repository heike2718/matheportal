package de.mathejungalt.matheportal.shell.domain.logout;

import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.matheportal.shell.domain.session.SessionCookieAdapter;

import lombok.extern.slf4j.Slf4j;

/**
 * LogoutService.
 */
@ApplicationScoped
@Slf4j
public class LogoutService {

    @Inject
    SessionCookieAdapter sessionCookieAdapter;

    @Inject
    SessionFacade sessionFacade;

    /**
     * Löscht die Session, falls vorhanden.
     */
    public void logout() {

        final Optional<String> optSessionId = sessionCookieAdapter.getSessionId();

        if (optSessionId.isPresent()) {
            try {
                sessionFacade.invalidateSessionQuietly(optSessionId.get());
            } catch (final Exception e) {
                log
                        .error("Exception beim Loeschen der Session mit der sessionId={}: {}", optSessionId.get(),
                                e.getMessage(), e);
            }
        } else {
            log.debug("keine sessionId im Session-Cookie vorhanden, kann ignoriert werden");
        }
    }
}
