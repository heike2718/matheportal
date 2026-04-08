package de.mathejungalt.authsessions.api;

import de.mathejungalt.authsessions.internal.session.SessionDto;
import de.mathejungalt.authsessions.internal.session.SessionService;
import de.mathejungalt.authsessions.api.exceptions.InvalidTokenException;
import de.mathejungalt.authsessions.api.exceptions.SessionExpiredException;
import de.mathejungalt.authsessions.internal.jwt.JWTService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * SessionFacade.
 */
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
     * @throws InvalidTokenException wenn das token ungültig ist.
     */
    public SessionDto createSession(final String rawJwt, final int idleTimeoutMinutes) throws InvalidTokenException {

        final AuthenticatedUser authenticatedUser = jwtService.mapJWT(rawJwt);

        return sessionService.createSession(authenticatedUser, idleTimeoutMinutes);
    }

    /**
     * Läd die Session und verlängert sie, falls möglich.<br>
     * <br>
     * Die Session kann nicht verlängert werden, wenn sie bereits abgelaufen ist (zu
     * lange idle) oder ihre maximale Lebensspanne überschritten hat.
     * 
     * @param sessionId          String
     * @param idleTimeoutMinutes int Anzahl Minuten der Untätigkeit.
     * @param maxLifetimeMinutes int maximal mögliche Lebensdauer einer Session in
     *                           Minuten.
     * @return SessionDto
     * @throws SessionExpiredException wenn die Session abgelaufen ist oder nicht
     *                                 mehr verlängert werden kann.
     */
    public SessionDto reloadSession(final String sessionId, final int idleTimeoutMinutes, final int maxLifetimeMinutes)
            throws SessionExpiredException {

        return sessionService.reloadSession(sessionId, idleTimeoutMinutes, maxLifetimeMinutes);
    }

    /**
     * Löscht die Session.
     * 
     * @param sessionId String
     */
    public void invalidateSession(final String sessionId) {

        sessionService.invalidateSession(sessionId);

    }

}
