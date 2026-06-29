package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuerenderRequest;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.WettbewerbsdurchfuehrenderApi;

/**
 * WettbewerbsdurchfuehrenderResource.
 */
@ApplicationScoped
@Authenticated
public class WettbewerbsdurchfuehrenderResource implements WettbewerbsdurchfuehrenderApi {

    @Override
    public Response createWettbewerbsdurchfuehrenden(
            @Valid @NotNull final WettbewerbsdurchfuerenderRequest wettbewerbsdurchfuerenderRequest) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Response loadWettbewerbsdurchfuehrenden() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Response updateWettbewerbsdurchfuehrenden(
            @Valid @NotNull final WettbewerbsdurchfuerenderRequest wettbewerbsdurchfuerenderRequest) {
        // TODO Auto-generated method stub
        return null;
    }

}
