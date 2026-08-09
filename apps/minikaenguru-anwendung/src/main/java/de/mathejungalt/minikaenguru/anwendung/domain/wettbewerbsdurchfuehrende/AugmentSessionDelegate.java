package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.util.HashSet;
import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.security.SecurityIdentityAttributeKeys;

/**
 * AugmentSessionDelegate.
 */
@ApplicationScoped
public class AugmentSessionDelegate {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    SessionFacade sessionFacade;

    void augmentSession(final Wettbewerbsdurchfuehrungsart wettbewerbsdurchfuehrungsart) {
        final String sessionId = securityIdentity.getAttribute(SecurityIdentityAttributeKeys.SESSION_ID);
        final Set<String> roles = securityIdentity.getRoles();
        final Set<String> neueRollen = new HashSet<>(roles);
        neueRollen.add(wettbewerbsdurchfuehrungsart.toString());

        this.sessionFacade.augmentSession(sessionId, neueRollen);
    }
}
