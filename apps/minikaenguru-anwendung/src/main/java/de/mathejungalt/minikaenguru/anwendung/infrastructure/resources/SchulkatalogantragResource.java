package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schulkatalogantrag;
import de.mathejungalt.minikaenguru.anwendung.domain.schulkatalog.SchulkatalogantragService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.SchulkatalogantragApi;

/**
 * SchulkatalogantragResource.
 */
@Authenticated
public class SchulkatalogantragResource implements SchulkatalogantragApi {

    @Inject
    SchulkatalogantragService schulkatalogantragService;

    @Override
    public Response submitSchulkatalogantrag(@Valid @NotNull final Schulkatalogantrag schulkatalogantrag) {
        schulkatalogantragService.sendeSchulkatalogantrag(schulkatalogantrag);
        return Response.noContent().build();
    }
}
