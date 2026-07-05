package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuerenderRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.WettbewerbsdurchfuehrendeService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.WettbewerbsdurchfuehrenderApi;

/**
 * WettbewerbsdurchfuehrenderResource.
 */
@ApplicationScoped
@Authenticated
public class WettbewerbsdurchfuehrenderResource implements WettbewerbsdurchfuehrenderApi {

    @Inject
    WettbewerbsdurchfuehrendeService wettbewerbsdurchfuehrendeService;

    @Override
    public Response loadWettbewerbsdurchfuehrenden() {
        final Wettbewerbsdurchfuehrender responsePayload = wettbewerbsdurchfuehrendeService.loadDurchfuehrenden();
        if (responsePayload != null) {
            return Response.ok(responsePayload).build();
        }
        return Response.status(Status.NOT_FOUND).build();
    }

    @Override
    public Response createWettbewerbsdurchfuehrenden(
            @Valid @NotNull final WettbewerbsdurchfuerenderRequest wettbewerbsdurchfuerenderRequest) {
        final Wettbewerbsdurchfuehrender responsePayload = wettbewerbsdurchfuehrendeService.privatpersonAnlegen();
        return Response.status(Status.CREATED).entity(responsePayload).build();
    }

    @Override
    public Response updateWettbewerbsdurchfuehrenden(
            @Valid @NotNull final WettbewerbsdurchfuerenderRequest wettbewerbsdurchfuerenderRequest) {
        // TODO Auto-generated method stub
        return null;
    }

}
