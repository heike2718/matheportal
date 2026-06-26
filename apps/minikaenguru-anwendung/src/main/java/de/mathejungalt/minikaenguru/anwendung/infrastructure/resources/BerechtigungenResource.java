package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.berechtigungen.BerechtigungenService;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.User;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.BerechtigungenApi;

/**
 * BerechtigungenResource. Läd die Berechtigungen für Minikänguru für das Frontend nach.
 */
public class BerechtigungenResource implements BerechtigungenApi {

    @Inject
    BerechtigungenService berechtigungenService;

    @Override
    @Authenticated
    public Response loadBerechtigung() {
        final User user = berechtigungenService.getUser();

        return Response.ok(user).build();
    }

}
