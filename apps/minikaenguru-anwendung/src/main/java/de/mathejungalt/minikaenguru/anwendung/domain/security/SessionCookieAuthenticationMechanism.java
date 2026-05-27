package de.mathejungalt.minikaenguru.anwendung.domain.security;

import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;

import io.quarkus.security.identity.IdentityProviderManager;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.request.AuthenticationRequest;
import io.quarkus.vertx.http.runtime.security.ChallengeData;
import io.quarkus.vertx.http.runtime.security.HttpAuthenticationMechanism;
import io.quarkus.vertx.http.runtime.security.HttpCredentialTransport;

import io.smallrye.mutiny.Uni;

import de.mathejungalt.authsessions.api.SessionConstants;

import io.vertx.core.http.Cookie;
import io.vertx.ext.web.RoutingContext;

/**
 * SessionCookieAuthenticationMechanism.
 */
@ApplicationScoped
public class SessionCookieAuthenticationMechanism implements HttpAuthenticationMechanism {

    private static final String AUTH_HEADER_NAME = "WWW-Authenticate";
    private static final String AUTH_SCHEME = "Session";
    private static final String AUTH_REALM = "matheportal";

    @Override
    public Uni<SecurityIdentity> authenticate(final RoutingContext context,
            final IdentityProviderManager identityProviderManager) {
        final Cookie cookie = context.request().getCookie(SessionConstants.SESSION_COOKIE_NAME);

        if (cookie == null || cookie.getValue() == null || cookie.getValue().isBlank()) {
            return Uni.createFrom().nullItem();
        }

        final SessionIdAuthenticationRequest authenticationRequest = new SessionIdAuthenticationRequest(
                cookie.getValue());

        return identityProviderManager.authenticate(authenticationRequest);
    }

    @Override
    public Uni<ChallengeData> getChallenge(final RoutingContext context) {
        return Uni
                .createFrom()
                .item(new ChallengeData(401, AUTH_HEADER_NAME, AUTH_SCHEME + " realm=\"" + AUTH_REALM + "\""));
    }

    @Override
    public Set<Class<? extends AuthenticationRequest>> getCredentialTypes() {
        return Set.of(SessionIdAuthenticationRequest.class);
    }

    @Override
    public Uni<HttpCredentialTransport> getCredentialTransport(final RoutingContext context) {
        return Uni.createFrom().item(new HttpCredentialTransport(HttpCredentialTransport.Type.COOKIE, COOKIE_NAME));
    }

}
