package de.mathejungalt.minikaenguru.anwendung.infrastructure.security;

import java.util.Set;

import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response.Status;

import io.quarkus.security.identity.IdentityProviderManager;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.request.AuthenticationRequest;
import io.quarkus.vertx.http.runtime.security.ChallengeData;
import io.quarkus.vertx.http.runtime.security.HttpAuthenticationMechanism;
import io.quarkus.vertx.http.runtime.security.HttpCredentialTransport;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.smallrye.mutiny.Uni;

import io.vertx.core.http.Cookie;
import io.vertx.ext.web.RoutingContext;

/**
 * SessionCookieAuthenticationMechanism.
 */
@Priority(1)
@ApplicationScoped
public class SessionCookieAuthenticationMechanism implements HttpAuthenticationMechanism {

    private static final String AUTH_HEADER_NAME = "WWW-Authenticate";
    private static final String AUTH_SCHEME = "Session";
    private static final String AUTH_REALM = "matheportal";

    @ConfigProperty(name = "session.cookie.name")
    String sessionCookiName;

    @Override
    public Uni<SecurityIdentity> authenticate(final RoutingContext context,
            final IdentityProviderManager identityProviderManager) {
        final Cookie cookie = context.request().getCookie(sessionCookiName);

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
                .item(new ChallengeData(Status.UNAUTHORIZED.getStatusCode(), AUTH_HEADER_NAME,
                        AUTH_SCHEME + " realm=\"" + AUTH_REALM + "\""));
    }

    @Override
    public Set<Class<? extends AuthenticationRequest>> getCredentialTypes() {
        return Set.of(SessionIdAuthenticationRequest.class);
    }

    @Override
    public Uni<HttpCredentialTransport> getCredentialTransport(final RoutingContext context) {
        return Uni
                .createFrom()
                .item(new HttpCredentialTransport(HttpCredentialTransport.Type.COOKIE, sessionCookiName));
    }

}
