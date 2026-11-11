package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Auswertungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.schule.SchuleService;
import de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen.TeilnahmenService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.SchuleApi;

/**
 * SchuleResource.
 */
@Authenticated
public class SchuleResource implements SchuleApi {

    private static final String REGEXP_KUERZEL = "^[A-Z0-9]*$";

    private static final int MAX_SIZE_KUERZEL = 8;

    @Inject
    SchuleService schuleService;

    @Inject
    TeilnahmenService teilnahmenService;

    @Override
    public Response getWettbewerbskontextSchule(
            @Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) final String schuleId) {
        return Response.ok(schuleService.loadWettbewerbskontext(schuleId)).build();
    }

    @Override
    public Response loadAktuelleSchulteilnahme(
            @Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) final String schuleId) {
        return Response.ok(teilnahmenService.loadAktuelleSchulteilnahme(schuleId)).build();
    }

    @Override
    public Response loadAnmeldendePerson(
            @Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) final String schuleId) {
        return Response.ok(schuleService.getAnmeldendePerson(schuleId)).build();
    }

    @Override
    public Response loadSchulkollegium(
            @Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) final String schuleId) {
        return Response.ok(schuleService.getKollegium(schuleId)).build();
    }

    @Override
    public Response schuleAnmelden(@Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) String schuleId,
            @NotNull Auswertungsart auswertungsart) {
        return Response
                .status(Status.CREATED)
                .entity(teilnahmenService.schulteilnahmeAnlegen(schuleId, auswertungsart))
                .build();
    }

}
