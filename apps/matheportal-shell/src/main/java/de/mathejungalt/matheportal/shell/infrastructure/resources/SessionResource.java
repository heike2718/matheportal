package de.mathejungalt.matheportal.shell.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

import de.mathejungalt.matheportal.shell.domain.generated.AccessTokenRequest;
import de.mathejungalt.matheportal.shell.domain.generated.AuthUrlResponse;
import de.mathejungalt.matheportal.shell.domain.login.AuthproviderUrlService;
import de.mathejungalt.matheportal.shell.infrastructure.generated.SessionApi;

/**
 * SessionResource
 */
@Path("/api/session")
public class SessionResource implements SessionApi {

    @Inject
    AuthproviderUrlService authproviderUrlService;

    @Override
    public Response createSession(@Valid @NotNull final AccessTokenRequest accessTokenRequest) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createSession'");
    }

    @Override
    public Response deleteSession() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteSession'");
    }

    @Override
    public Response getLoginUrl() {
        final AuthUrlResponse payload = authproviderUrlService.getLoginUrl();
        return Response.ok(payload).build();
    }

    @Override
    public Response reloadSession() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'reloadSession'");
    }
}
