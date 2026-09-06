package de.mathejungalt.minikaenguru.admin.infrastructure.resources;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import de.mathejungalt.minikaenguru.admin.domain.generated.LandMitOrtUndSchuleAnlegenRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.OrtMitSchuleAnlegenRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleAnlegenOderAendernRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.Schulkuerzel;
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

    @Override
    public Response schuleAnlegen(@Valid @NotNull final LandMitOrtUndSchuleAnlegenRequest requestPayload) {
        final Schulkuerzel result = this.schulkatalogService.schuleAnlegen(requestPayload);
        return Response.status(Status.CREATED).entity(result).build();
    }

    @Override
    public Response schuleInLandAnlegen(@Pattern(regexp = "^[A-Z-]*$") @Size(max = 5) final String kuerzelLand,
            @Valid @NotNull final OrtMitSchuleAnlegenRequest requestPayload) {
        final Schulkuerzel result = this.schulkatalogService.schuleInLandAnlegen(kuerzelLand, requestPayload);
        return Response.status(Status.CREATED).entity(result).build();
    }

    @Override
    public Response schuleInOrtAnlegen(@Pattern(regexp = "^[A-Z0-9]*$") @Size(max = 8) final String kuerzelOrt,
            @Valid @NotNull final SchuleAnlegenOderAendernRequest requestPayload) {
        final Schulkuerzel result = this.schulkatalogService.schuleInOrtAnlegen(kuerzelOrt, requestPayload);
        return Response.status(Status.CREATED).entity(result).build();
    }

    @Override
    public Response schuleUmbenennen(@Pattern(regexp = "^[A-Z0-9]*$") @Size(max = 8) final String kuerzel,
            @Valid @NotNull final SchuleAnlegenOderAendernRequest requestPayload) {
        final Schulkuerzel result = schulkatalogService.schuleUmbenennen(kuerzel, requestPayload);
        return Response.ok(result).build();
    }

}
