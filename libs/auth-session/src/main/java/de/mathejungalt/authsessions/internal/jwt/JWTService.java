package de.mathejungalt.authsessions.internal.jwt;

import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.jwt.JsonWebToken;

import io.smallrye.jwt.auth.principal.JWTParser;

import de.mathejungalt.authsessions.api.AuthenticatedUser;
import de.mathejungalt.authsessions.api.exceptions.InvalidTokenException;

/**
 * JwtService.
 */
@ApplicationScoped
public class JWTService {

    private static final String CLAIM_FULL_NAME = "full_name";

    @Inject
    JWTParser jwtParser;

    /**
     * Mapped das JWT auf einen AuthenticatedUser.
     *
     * @param rawJwt String
     * @return
     * @throws InvalidTokenException wenn das JWT ungültig ist.
     */
    public AuthenticatedUser mapJWT(final String rawJwt) throws InvalidTokenException {

        try {
            final JsonWebToken token = jwtParser.parse(rawJwt);

            return AuthenticatedUser
                    .builder()
                    .uuid(token.getSubject())
                    .fullName(token.getClaim(CLAIM_FULL_NAME))
                    .roles(extractRoles(token))
                    .build();

        } catch (final Exception e) {
            throw new InvalidTokenException("JWT konnte nicht geparst werden", e);
        }

    }

    private Set<String> extractRoles(final JsonWebToken token) {
        final Set<String> groups = token.getGroups();
        return groups == null ? Set.of() : Set.copyOf(groups);
    }

}
