package de.mathejungalt.matheportal.shell.domain.session;

import java.util.Objects;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.NewCookie;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.apache.commons.lang3.StringUtils;

/**
 * SessionCookieAdapter. Ermittelt die sessionId aus dem Session-Cookie
 */
@ApplicationScoped
public class SessionCookieAdapter {

    @ConfigProperty(name = "session.cookie.name")
    String sessionCookiName;

    @ConfigProperty(name = "session.cookie.path")
    String sessionCookiPath;

    @ConfigProperty(name = "session.cookie.secure")
    boolean sessionCookieSecure;

    @Inject
    HttpHeaders httpHeaders;

    /**
     * Ermittelt die sessionId.
     *
     * @return Optional
     */
    public Optional<String> getSessionId() {

        final Cookie cookie = httpHeaders.getCookies().get(sessionCookiName);

        if (cookie == null || StringUtils.isBlank(cookie.getValue())) {
            return Optional.empty();
        }

        return Optional.of(cookie.getValue());
    }

    /**
     * Generiert das Session-Cookie.
     *
     * @param sessionId String
     * @return NewCookie
     */
    public NewCookie createSessionCookie(final String sessionId) {
        Objects.requireNonNull(sessionId);

        return new NewCookie.Builder(sessionCookiName)
                .value(sessionId)
                .path(sessionCookiPath)
                .httpOnly(true)
                .secure(sessionCookieSecure)
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

        return new NewCookie.Builder(sessionCookiName)
                .value("")
                .path(sessionCookiPath)
                .maxAge(0)
                .httpOnly(true)
                .secure(sessionCookieSecure)
                .sameSite(NewCookie.SameSite.LAX)
                .build();
    }
}
