package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import java.util.List;

import jakarta.inject.Inject;
import jakarta.validation.constraints.Pattern;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Ort;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
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
        final List<Ort> orte = schulkatalogService.findOrte(name);
        return Response.ok(orte).build();
    }

    @Override
    public Response loadSchulen(final String ortId) {
        final List<Schule> schulen = schulkatalogService.loadSchulen(ortId);
        return Response.ok(schulen).build();
    }

    @Override
    public Response getSchule(@Pattern(regexp = "^[A-Z0-9]*$") final String schuleId) {
        final Schule schule = schulkatalogService.getSchule(schuleId);
        return Response.ok(schule).build();
    }
}
