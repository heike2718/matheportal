package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import io.quarkus.security.Authenticated;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.KlasseRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.schule.KlasseService;
import de.mathejungalt.minikaenguru.anwendung.domain.shared.PatternConstants;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.KlasseApi;

/**
 * KlasseResource.
 */
@Authenticated
public class KlasseResource implements KlasseApi {

    @Inject
    KlasseService klasseService;

    @Override
    public Response getKlasse(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
            @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId,
            @Pattern(regexp = PatternConstants.REGEXP_UUID)
            @Size(max = PatternConstants.MAX_SIZE_UUID) final String klasseId) {

        return Response.ok(klasseService.loadKlasse(schuleId, klasseId)).build();

    }

    @Override
    public Response klasseAendern(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
            @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId,
            @Pattern(regexp = PatternConstants.REGEXP_UUID)
            @Size(max = PatternConstants.MAX_SIZE_UUID) final String klasseId,
            @Valid @NotNull KlasseRequest klasseRequest) {

        return Response.ok(klasseService.klasseAendern(schuleId, klasseId, klasseRequest)).build();
    }

    @Override
    public Response klasseLoeschen(
            @Pattern(regexp = PatternConstants.REGEXP_KUERZEL)
            @Size(max = PatternConstants.MAX_SIZE_KUERZEL_SCHULKATALOG) final String schuleId,
            @Pattern(regexp = PatternConstants.REGEXP_UUID)
            @Size(max = PatternConstants.MAX_SIZE_UUID) final String klasseId) {

        klasseService.klasseLoeschen(schuleId, klasseId);
        return Response.status(Status.NO_CONTENT).build();
    }

}
