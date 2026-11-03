package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.schule.SchuleService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.SchulenApi;

/**
 * SchulenResource.
 */
@Authenticated
public class SchulenResource implements SchulenApi {

    private static final String REGEXP_KUERZEL = "^[A-Z0-9]*$";

    private static final int MAX_SIZE_KUERZEL = 8;

    @Inject
    SchuleService schuleService;

    @Override
    public Response getWettbewerbskontextSchule(
            @Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) final String schuleId) {
        return Response.ok(schuleService.loadWettbewerbskontext(schuleId)).build();
    }

    @Override
    public Response loadAktuelleSchulteilnahme(
            @Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) final String schuleId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'loadAktuelleSchulteilnahme'");
    }

    @Override
    public Response loadAnmeldendePerson(
            @Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) final String schuleId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'loadAnmeldendePerson'");
    }

    @Override
    public Response loadSchulkollegium(
            @Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) final String schuleId) {
        return Response.ok(schuleService.getKollegium(schuleId)).build();
    }

    @Override
    public Response schuleAnmelden(
            @Pattern(regexp = REGEXP_KUERZEL) @Size(max = MAX_SIZE_KUERZEL) final String schuleId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'schuleAnmelden'");
    }

}
