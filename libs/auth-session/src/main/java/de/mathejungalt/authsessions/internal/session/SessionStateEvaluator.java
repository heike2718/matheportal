package de.mathejungalt.authsessions.internal.session;

import java.time.Clock;
import java.time.LocalDateTime;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.authsessions.internal.session.entities.SessionEntity;

/**
 * SessionStateEvaluator.
 */
@ApplicationScoped
public class SessionStateEvaluator {

    @Inject
    Clock clock;

    boolean isSessionValid(final SessionEntity session, final int maxLifetimeSeconds) {
        final LocalDateTime now = LocalDateTime.now(clock);

        if (now.isAfter(session.getExpiresAt())) {
            return false;
        }

        if (now.isAfter(session.getCreatedAt().plusSeconds(maxLifetimeSeconds))) {
            return false;
        }

        return true;
    }

}
