package de.mathejungalt.minikaenguru.anwendung.domain.security;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.control.ActivateRequestContext;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.VeranstalterDao;

/**
 * VeranstalterEntityAugmentor. Ergänzt die SecurityIdentity um eine Rolle, die dem Typ des Veranstalters entspricht und
 * packt den Typ und die teilnahmekuerzel hinein.
 */
@ApplicationScoped
public class VeranstalterEntityAugmentor {

    @Inject
    VeranstalterDao veranstalterDao;

    @ActivateRequestContext
    public SecurityIdentity augment(final SecurityIdentity identity) {
        final QuarkusSecurityIdentity.Builder builder = QuarkusSecurityIdentity.builder(identity);

        final String subject = identity.getPrincipal().getName();

        veranstalterDao.findByUserUuid(subject).ifPresent((veranstalterEntity) -> {

            switch (veranstalterEntity.getTyp()) {
            case LEHRER -> builder.addRole("LEHRER");
            case PRIVAT -> builder.addRole("PRIVAT");
            }

            // builder.addAttribute("veranstalterTyp", veranstalterEntity.getTyp());
            // builder.addAttribute("teilnahmekuerzel",
            // veranstalterEntity.getTeilnahmekuerzel());

        });

        return identity;
    }

}
