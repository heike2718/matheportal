package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.authorization.AuthorizationService;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.User;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.BerechtigungenApi;

/**
 * BerechtigungenResource
 */
public class BerechtigungenResource implements BerechtigungenApi {

    @Inject
    AuthorizationService authorizationService;

    @Override
    @Authenticated
    public Response loadBerechtigung() {
        final User user = authorizationService.findAuthenticatedUser();

        return Response.ok(user).build();

    }

}
