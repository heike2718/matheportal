package de.mathejungalt.minikaenguru.anwendung.domain.security;

import java.util.HashSet;
import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.control.ActivateRequestContext;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;

import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.VeranstalterDao;

/**
 * VeranstalterEntityAugmentor. Ergänzt die SecurityIdentity um eine Rolle, die dem Typ des Veranstalters entspricht und
 * packt den Typ und die teilnahmekuerzel hinein.
 */
@ApplicationScoped
public class VeranstalterEntityAugmentor {

    @Inject
    VeranstalterDao veranstalterDao;

    @Inject
    SessionFacade sessionFacade;

    @ActivateRequestContext
    public SecurityIdentity augment(final SecurityIdentity identity) {
        final QuarkusSecurityIdentity.Builder builder = QuarkusSecurityIdentity.builder(identity);

        final String subject = identity.getPrincipal().getName();

        veranstalterDao.findByUserUuid(subject).ifPresent((veranstalterEntity) -> {

            final String sessionId = identity.getAttribute(SecurityIdentityAttributeKeys.SESSIION_ID);
            final String berechtigung = veranstalterEntity.getTyp().toString();
            builder.addRole(berechtigung);
            final Set<String> berechtigungen = new HashSet<>(identity.getRoles());
            berechtigungen.add(berechtigung);
            sessionFacade.updateSession(sessionId, berechtigungen);
        });

        builder
                .addAttribute(SecurityIdentityAttributeKeys.AUGMENTATION_STATE,
                        SecurityIdentityAugmentationState.AUGMENTED.toString());

        return builder.build();
    }
}
