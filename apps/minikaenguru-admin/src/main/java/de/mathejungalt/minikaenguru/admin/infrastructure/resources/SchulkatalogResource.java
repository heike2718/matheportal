package de.mathejungalt.minikaenguru.admin.infrastructure.resources;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.core.Response;

import de.mathejungalt.minikaenguru.admin.domain.schulkatalog.SchulkatalogService;
import de.mathejungalt.minikaenguru.admin.infrastructure.generated.SchulkatalogApi;

/**
 * SchulkatalogResource.
 */
@RolesAllowed({ "ADMIN" })
public class SchulkatalogResource implements SchulkatalogApi {

    @Inject
    SchulkatalogService schulkatalogService;

    @Override
    public Response loadLaender() {
        return Response.ok(schulkatalogService.loadLaender()).build();
    }

    @Override
    public Response loadOrte(@Pattern(regexp = "^[A-Z-]*$") @Size(max = 5) final String kuerzelLand) {
        return Response.ok(schulkatalogService.loadOrteInLand(kuerzelLand)).build();
    }

    @Override
    public Response loadSchulen(@Pattern(regexp = "^[A-Z0-9]*$") @Size(max = 8) final String kuerzelOrt) {
        return Response.ok(schulkatalogService.loadSchulenInOrt(kuerzelOrt)).build();
    }

}
