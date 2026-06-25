package de.mathejungalt.minikaenguru.anwendung.domain.authorization;

import java.util.Map;
import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.User;

/**
 * AuthorizationService.
 */
@ApplicationScoped
public class AuthorizationService {

    @Inject
    SecurityIdentity securityIdentity;

    /**
     * @return User
     */
    public User findAuthenticatedUser() {

        final Map<String, Object> attributes = securityIdentity.getAttributes();

        return new User("platzhalter", Set.of("LEHRER"));
    }

}
