package de.mathejungalt.minikaenguru.anwendung.domain.security;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.SecurityIdentityAugmentor;

import io.smallrye.mutiny.Uni;

/**
 * MinikaenguruSecurityIdentityAugmentor.
 */
@ApplicationScoped
public class MinikaenguruSecurityIdentityAugmentor implements SecurityIdentityAugmentor {

    @Inject
    VeranstalterEntityAugmentor veranstalterEntityAugmentor;

    @Override
    public Uni<SecurityIdentity> augment(final SecurityIdentity securityIdentity,
            final AuthenticationRequestContext context) {

        if (securityIdentity.isAnonymous()) {
            return Uni.createFrom().item(securityIdentity);
        }

        return context.runBlocking(() -> veranstalterEntityAugmentor.augment(securityIdentity));
    }
}
