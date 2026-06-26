package de.mathejungalt.minikaenguru.anwendung.infrastructure.security;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.SecurityIdentityAugmentor;

import io.smallrye.mutiny.Uni;

import de.mathejungalt.authsessions.api.SecurityIdentityAugmentationState;

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

        final SecurityIdentityAugmentationState augmentationState = securityIdentity
                .getAttribute(SecurityIdentityAttributeKeys.AUGMENTATION_STATE);

        if (augmentationState == SecurityIdentityAugmentationState.NOT_AUGMENTED) {
            // verhindert unnötige DB-Rundreisen.
            return context.runBlocking(() -> veranstalterEntityAugmentor.augment(securityIdentity));

        }

        return Uni.createFrom().item(securityIdentity);
    }
}
