package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.WettbewerbsdurchfuehrendeService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.LehrpersonApi;

@Authenticated
public class LehrpersonResource implements LehrpersonApi {

    @Inject
    WettbewerbsdurchfuehrendeService wettbewerbsdurchfuehrendeService;

    @Override
    public Response loadMySchools() {
        return Response.ok(wettbewerbsdurchfuehrendeService.loadMySchools()).build();
    }

}
