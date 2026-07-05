package de.mathejungalt.minikaenguru.anwendung.infrastructure.security;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.AuthenticationFailedException;
import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.IdentityProvider;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.smallrye.mutiny.Uni;

import de.mathejungalt.authsessions.api.AuthenticatedUser;
import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.authsessions.api.exceptions.SessionValidationFailedException;

/**
 * SessionIdIdentityProvider.<br>
 * <br>
 * Hier weren der SecurityIdentity die Attribute sessionId und fullName hinzugefügt. Diese werden vom
 * MinikaenguruSecurityIdentityAugmentor, vom WettbewerbsdurchfuehrenderEntityAugmentor und vom BerechtigungenService
 * benötigt, um den Typ als Role für RBAC verfügbar zu haben und die session in der DB und den User im Portal synchron
 * zu halten.<br>
 * <br>
 * Eine nich aktive session wird gleichzeitig verlängert.
 */
@ApplicationScoped
public class SessionIdIdentityProvider implements IdentityProvider<SessionIdAuthenticationRequest> {

    @ConfigProperty(name = "session.idle.timeout")
    int sessionIdleTimeoutMinutes;

    @ConfigProperty(name = "session.max.lifetime")
    int maxLifetimeMinutes;

    @Inject
    SessionFacade sessionFacade;

    @Override
    public Uni<SecurityIdentity> authenticate(final SessionIdAuthenticationRequest authenticationRequest,
            final AuthenticationRequestContext context) {
        return context.runBlocking(() -> authenticateBlocking(authenticationRequest));
    }

    @Override
    public Class<SessionIdAuthenticationRequest> getRequestType() {
        return SessionIdAuthenticationRequest.class;
    }

    private SecurityIdentity authenticateBlocking(final SessionIdAuthenticationRequest authenticationRequest) {

        try {
            final SessionDto sessionDto = sessionFacade
                    .reloadSession(authenticationRequest.getSessionId(), sessionIdleTimeoutMinutes, maxLifetimeMinutes);

            final AuthenticatedUser authenticatedUser = sessionDto.getAuthenticatedUser();

            return QuarkusSecurityIdentity
                    .builder()
                    .setPrincipal(authenticatedUser::getUuid)
                    .addRoles(authenticatedUser.getBerechtigungen())
                    .addAttribute(SecurityIdentityAttributeKeys.FULL_NAME, authenticatedUser.getFullName())
                    .addAttribute(SecurityIdentityAttributeKeys.SESSION_ID, authenticationRequest.getSessionId())
                    .addAttribute(SecurityIdentityAttributeKeys.AUGMENTATION_STATE, sessionDto.getAugmentationState())
                    .build();
        } catch (final SessionValidationFailedException e) {
            throw new AuthenticationFailedException("Session ist abgelaufen", e);
        }
    }
}
