package de.mathejungalt.minikaenguru.anwendung.domain.berechtigungen;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.User;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.security.SecurityIdentityAttributeKeys;

import lombok.extern.slf4j.Slf4j;

/**
 * BerechtigungenService.
 */
@Slf4j
@ApplicationScoped
public class BerechtigungenService {

    @Inject
    SecurityIdentity securityIdentity;

    /**
     * @return User
     * @throws IllegalStateException wenn die SecurityIdentity unvollständig ist.
     */
    public User getUser() throws IllegalStateException {

        final String fullName = securityIdentity.getAttribute(SecurityIdentityAttributeKeys.FULL_NAME);

        if (fullName == null) {

            final String message = "Attribut " + SecurityIdentityAttributeKeys.FULL_NAME
                    + " fehlt in der SecurityIdentity. SessionIdIdentityProvider pruefen!";

            throw new IllegalStateException(message);
        }
        return new User(fullName, securityIdentity.getRoles());
    }
}
