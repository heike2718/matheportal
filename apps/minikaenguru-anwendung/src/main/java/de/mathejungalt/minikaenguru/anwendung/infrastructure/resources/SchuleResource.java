package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Auswertungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.KlasseRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.schule.SchuleService;
import de.mathejungalt.minikaenguru.anwendung.domain.shared.PatternConstants;
import de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen.TeilnahmenService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.SchuleApi;

/**
 * SchuleResource.
 */
@Authenticated
public class SchuleResource implements SchuleApi {

    @Inject
    SchuleService schuleService;

    @Inject
    TeilnahmenService teilnahmenService;

    @Override
    public Response getWettbewerbskontextSchule(@Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
    @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId) {
        return Response.ok(schuleService.loadWettbewerbskontext(schuleId)).build();
    }

    @Override
    public Response loadAktuelleSchulteilnahme(@Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
    @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId) {
        return Response.ok(teilnahmenService.loadAktuelleSchulteilnahme(schuleId)).build();
    }

    @Override
    public Response loadAnmeldendePerson(@Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
    @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId) {
        return Response.ok(schuleService.getAnmeldendePerson(schuleId)).build();
    }

    @Override
    public Response loadSchulkollegium(@Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
    @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId) {
        return Response.ok(schuleService.getKollegium(schuleId)).build();
    }

    @Override
    public Response schuleAnmelden(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
            @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId,
            @NotNull final Auswertungsart auswertungsart) {
        return Response
                .status(Status.CREATED)
                .entity(teilnahmenService.schulteilnahmeAnlegen(schuleId, auswertungsart))
                .build();
    }

    @Override
    public Response klasseAnlegen(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL) @Size(max = 8) final String schuleId,
            @Valid @NotNull final KlasseRequest klasseRequest) {
        return Response.status(Status.CREATED).entity(schuleService.klasseAnlegen(schuleId, klasseRequest)).build();
    }

    @Override
    public Response klassenLoeschen(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL) @Size(max = 8) final String schuleId) {
        schuleService.alleKlassenLoeschen(schuleId);
        return Response.status(Status.NO_CONTENT).build();
    }

    @Override
    public Response loadKlassen(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL) @Size(max = 8) final String schuleId) {
        return Response.ok(schuleService.loadKlassen(schuleId)).build();
    }

    @Override
    public Response getKlasse(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
            @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId,
            @Pattern(regexp = PatternConstants.REGEXP_UUID)
            @Size(max = PatternConstants.MAX_SIZE_UUID) final String klasseId) {

        return Response.ok(schuleService.loadKlasse(schuleId, klasseId)).build();

    }

    @Override
    public Response klasseAendern(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
            @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId,
            @Pattern(regexp = PatternConstants.REGEXP_UUID)
            @Size(max = PatternConstants.MAX_SIZE_UUID) final String klasseId,
            @Valid @NotNull KlasseRequest klasseRequest) {

        return Response.ok(schuleService.klasseAendern(schuleId, klasseId, klasseRequest)).build();
    }

    @Override
    public Response klasseLoeschen(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
            @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId,
            @Pattern(regexp = PatternConstants.REGEXP_UUID)
            @Size(max = PatternConstants.MAX_SIZE_UUID) final String klasseId) {

        schuleService.klasseLoeschen(schuleId, klasseId);
        return Response.status(Status.NO_CONTENT).build();
    }

}
