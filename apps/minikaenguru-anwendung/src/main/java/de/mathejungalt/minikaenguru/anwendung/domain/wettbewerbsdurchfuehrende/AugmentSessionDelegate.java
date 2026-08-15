package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.util.HashSet;
import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.security.SecurityIdentityAttributeKeys;

/**
 * AugmentSessionDelegate.
 */
@ApplicationScoped
public class AugmentSessionDelegate {

    @ConfigProperty(name = "mock.augment.session")
    boolean mockAugmentSession;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    SessionFacade sessionFacade;

    /**
     * Augmentiert eine vorhandene Session umd die Pseudorolle.
     *
     * @param wettbewerbsdurchfuehrungsart Wettbewerbsdurchfuehrungsart
     */
    public void augmentSession(final Wettbewerbsdurchfuehrungsart wettbewerbsdurchfuehrungsart) {

        if (mockAugmentSession) {
            return;
        }

        final String sessionId = securityIdentity.getAttribute(SecurityIdentityAttributeKeys.SESSION_ID);
        final Set<String> roles = securityIdentity.getRoles();
        final Set<String> neueRollen = new HashSet<>(roles);
        neueRollen.add(wettbewerbsdurchfuehrungsart.toString());

        this.sessionFacade.augmentSession(sessionId, neueRollen);
    }
}
