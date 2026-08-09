package de.mathejungalt.minikaenguru.anwendung.infrastructure.security;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.control.ActivateRequestContext;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;

import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

/**
 * WettbewerbsdurchfuehrenderEntityAugmentor. Ergänzt die SecurityIdentity um eine Rolle, die dem Typ der Berechtigung
 * für Minikänguru entspricht, und packt den Typ und die teilnahmekuerzel hinein.
 */
@ApplicationScoped
public final class WettbewerbsdurchfuehrenderEntityAugmentor {

    @Inject
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    @Inject
    SessionFacade sessionFacade;

    @ActivateRequestContext
    public SecurityIdentity augment(final SecurityIdentity identity) {

        final String sessionId = identity.getAttribute(SecurityIdentityAttributeKeys.SESSION_ID);

        if (sessionId == null) {
            final String message = "Attribut " + SecurityIdentityAttributeKeys.SESSION_ID
                    + " fehlt in der SecurityIdentity. SessionIdIdentityProvider pruefen!";

            throw new IllegalStateException(message);
        }

        final QuarkusSecurityIdentity.Builder builder = QuarkusSecurityIdentity.builder(identity);
        final String subject = identity.getPrincipal().getName();

        final Optional<WettbewerbsdurchfuehrenderEntity> opt = wettbewerbsdurchfuehrenderDao.findByUserUuid(subject);
        if (opt.isPresent()) {
            final WettbewerbsdurchfuehrenderEntity entity = opt.get();

            final String berechtigung = entity.getArt().name();
            builder.addRole(berechtigung);
            final Set<String> berechtigungen = new HashSet<>(identity.getRoles());
            berechtigungen.add(berechtigung);
            sessionFacade.augmentSession(sessionId, berechtigungen);
        } else {
            sessionFacade.markSessionAugmentationChecked(sessionId);
        }

        return builder.build();
    }
}
