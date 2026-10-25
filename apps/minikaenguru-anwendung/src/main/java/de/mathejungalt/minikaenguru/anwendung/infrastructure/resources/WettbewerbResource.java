package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.WettbewerbApi;

/**
 * WettbewerbResource
 */
public class WettbewerbResource implements WettbewerbApi {

    @Inject
    WettbewerbService wettbewerbService;

    @Override
    public Response loadAktuellenWettbewerb() {
        return Response.ok(wettbewerbService.loadAktuellenWettbewerb()).build();
    }
}
