package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.schulkatalog.SchulkatalogService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.SchulkatalogApi;

/**
 * SchulkatalogResource.
 */
@Authenticated
public class SchulkatalogResource implements SchulkatalogApi {

    @Inject
    SchulkatalogService schulkatalogService;

    @Override
    public Response findOrte(final String name) {
        return Response.ok(schulkatalogService.findOrte(name)).build();
    }

    @Override
    public Response loadSchulen(final String ortId) {
        return Response.ok(schulkatalogService.loadSchulen(ortId)).build();
    }
}
