package de.mathejungalt.minikaenguru.anwendung.domain.berechtigungen;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.User;
import de.mathejungalt.minikaenguru.anwendung.domain.security.SecurityIdentityAttributeKeys;

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
     */
    public User getUser() {

        final String fullName = securityIdentity.getAttribute(SecurityIdentityAttributeKeys.FULL_NAME);
        if (fullName == null) {
            log
                    .warn("Attribut {} war in der SecurityIdentity nicht gesetzt! ",
                            SecurityIdentityAttributeKeys.FULL_NAME);
            return new User("kein Name", securityIdentity.getRoles());
        }
        return new User(fullName, securityIdentity.getRoles());
    }

}
