package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Teilnahme;
import de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen.TeilnahmenService;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.WettbewerbsdurchfuehrendeService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.PrivatpersonApi;

@Authenticated
public class PrivatpersonResource implements PrivatpersonApi {

    @Inject
    WettbewerbsdurchfuehrendeService wettbewerbsdurchfuehrendeService;

    @Inject
    TeilnahmenService teilnahmenService;

    @Override
    public Response loadMyAktuelleTeilnahme() {
        final Teilnahme teilnahme = teilnahmenService.loadAktuellePrivatteilnahme();
        return Response.status(Status.OK).entity(teilnahme).build();
    }

    @Override
    public Response loadMyWettbewerbskontext() {
        return Response.ok(wettbewerbsdurchfuehrendeService.loadMyWettbewerbskontext()).build();
    }

    @Override
    public Response privatpersonAnmelden() {
        final Teilnahme teilnahme = teilnahmenService.privatteilnahmeAnlegen();
        return Response.status(Status.CREATED).entity(teilnahme).build();
    }
}
