package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.User;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Veranstalter;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.VeranstalterResponseDto;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.generated.VeranstalterApi;

/**
 * VeranstalterResource.
 */
public class VeranstalterResource implements VeranstalterApi {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    SessionFacade sessionFacade;

    @Override
    @Authenticated
    public Response loadVeranstalter() {

        User user = new User()
                .addBerechtigungenItem("STANDARD")
                .addBerechtigungenItem("LEHRER")
                .fullName("Platzhalter");

        Veranstalter veranstalter = new Veranstalter()
                .newsletter(false)
                .zugangsstatusUnterlagen(Veranstalter.ZugangsstatusUnterlagenEnum.ENTZOGEN)
                .addTeilnahmenummernItem("ABCDEFGH");

        VeranstalterResponseDto payload = new VeranstalterResponseDto().user(user).veranstalter(veranstalter);

        return Response.ok(payload).build();

    }

}
