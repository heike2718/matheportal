package de.mathejungalt.authsessions.api;

import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;

import de.mathejungalt.authsessions.api.exceptions.InvalidJWTException;
import de.mathejungalt.authsessions.api.exceptions.SessionValidationFailedException;
import de.mathejungalt.authsessions.internal.jwt.JWTService;
import de.mathejungalt.authsessions.internal.session.SessionService;

import lombok.extern.slf4j.Slf4j;

/**
 * SessionFacade.
 */
@Slf4j
@ApplicationScoped
public class SessionFacade {

    @Inject
    JWTService jwtService;

    @Inject
    SessionService sessionService;

    /**
     * Erzeugt eine Session aus dem gegebenen JWT.
     *
     * @param rawJwt String das JWT
     * @return SessionDto
     * @throws InvalidJWTException wenn das JWT ungültig ist.
     */
    public SessionDto createSession(final String rawJwt, final int idleTimeoutMinutes) throws InvalidJWTException {

        final AuthenticatedUser authenticatedUser = jwtService.mapJWT(rawJwt);

        return sessionService.createSession(authenticatedUser, idleTimeoutMinutes);
    }

    /**
     * Läd die Session und verlängert sie, falls möglich.<br>
     * <br>
     * Die Session kann nicht verlängert werden, wenn sie bereits abgelaufen ist (zu lange idle) oder ihre maximale
     * Lebensspanne überschritten hat.
     *
     * @param sessionId          String
     * @param idleTimeoutMinutes int Anzahl Minuten der Untätigkeit.
     * @param maxLifetimeMinutes int maximal mögliche Lebensdauer einer Session in Minuten.
     * @return SessionDto
     * @throws SessionValidationFailedException wenn es keine Session gab, die Session abgelaufen ist oder nicht mehr
     *                                          verlängert werden kann.
     */
    public SessionDto reloadSession(final String sessionId, final int idleTimeoutMinutes, final int maxLifetimeMinutes)
            throws SessionValidationFailedException {

        return sessionService.reloadSession(sessionId, idleTimeoutMinutes, maxLifetimeMinutes);
    }

    /**
     * Löscht die Session. Alle Ausnahmezustände werden still behandelt, ohne dass eine Exception geworfen wird
     *
     * @param sessionId String
     */
    public void invalidateSessionQuietly(final String sessionId) {

        sessionService.invalidateSession(sessionId);

    }

    /**
     * Aktualisiert die Berechtigungen in der Session und setzt den status auf AUGMENTED. Das ist erforderlich, um
     * Metaberechtigungen der Minikänguru-Anwendung als Role für RBAC zur Verfügung zu haben.
     *
     * @param sessionId      String die sessionId
     * @param berechtigungen Set berechtigungen, die zu dieser SessionId gespeichert werden müssen.
     */
    public void augmentSession(final String sessionId, final Set<String> berechtigungen) {
        try {
            sessionService.augmentSessionQuietlySessionQuietly(sessionId, berechtigungen);
        } catch (final PersistenceException e) {
            log.error("session: Berechtigungen konnten nicht aktualisiert werden: {}", e.getMessage(), e);
        }
    }

    /**
     * Markiert die session als für zusätzliche Berechtigungen geprüft. Es gab keine anwendungsspezifischen
     * Anreicherungen.
     *
     * @param sessionId String die sessionId
     */
    public void markSessionAugmentationChecked(final String sessionId) {

        try {
            sessionService.markSessionAugmentationChecked(sessionId);
        } catch (final PersistenceException e) {
            log.error("session: konnte nicht als geprüueft markiert werden.: {}", e.getMessage(), e);
        }
    }
}
