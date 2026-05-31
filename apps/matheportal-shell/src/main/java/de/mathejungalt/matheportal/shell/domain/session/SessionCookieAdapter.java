package de.mathejungalt.matheportal.shell.domain.session;

import java.util.Objects;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.NewCookie;

import org.apache.commons.lang3.StringUtils;

import de.mathejungalt.authsessions.api.SessionConstants;

/**
 * SessionCookieAdapter. Ermittelt die sessionId aus dem Session-Cookie
 */
@ApplicationScoped
public class SessionCookieAdapter {

    @Inject
    HttpHeaders httpHeaders;

    /**
     * Ermittelt die sessionId.
     *
     * @return Optional
     */
    public Optional<String> getSessionId() {

        final Cookie cookie = httpHeaders.getCookies().get(SessionConstants.SESSION_COOKIE_NAME);

        if (cookie == null || StringUtils.isBlank(cookie.getValue())) {
            return Optional.empty();
        }

        return Optional.of(cookie.getValue());
    }

    /**
     * Generiert das Session-Cookie
     *
     * @param sessionId String
     * @return NewCookie
     */
    public NewCookie createSessionCookie(final String sessionId) {
        Objects.requireNonNull(sessionId);

        return new NewCookie.Builder(SessionConstants.SESSION_COOKIE_NAME)
                .value(sessionId)
                .path(SessionConstants.SESSION_COOKIE_PATH)
                .httpOnly(true)
                .secure(true)
                .sameSite(NewCookie.SameSite.LAX)
                .maxAge(-1)
                .build();
    }

    /**
     * Erzeugt ein Cookie, das ein vorandenes Cookie im Frontend löscht.
     *
     * @return NewCookie
     */
    public NewCookie createExpiredSessionCookie() {

        return new NewCookie.Builder(SessionConstants.SESSION_COOKIE_NAME)
                .value("")
                .path(SessionConstants.SESSION_COOKIE_PATH)
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .sameSite(NewCookie.SameSite.LAX)
                .build();
    }
}
