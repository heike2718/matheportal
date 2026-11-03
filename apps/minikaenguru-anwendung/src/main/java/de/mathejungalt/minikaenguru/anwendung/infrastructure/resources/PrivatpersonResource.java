package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.WettbewerbsdurchfuehrendeService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.PrivatpersonApi;

@Authenticated
public class PrivatpersonResource implements PrivatpersonApi {

    @Inject
    WettbewerbsdurchfuehrendeService wettbewerbsdurchfuehrendeService;

    @Override
    public Response loadMyAktuelleTeilnahme() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'loadMyAktuelleTeilnahme'");
    }

    @Override
    public Response loadMyWettbewerbskontext() {
        return Response.ok(wettbewerbsdurchfuehrendeService.loadMyWettbewerbskontext()).build();
    }

    @Override
    public Response privatpersonAnmelden() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'privatpersonAnmelden'");
    }

}
