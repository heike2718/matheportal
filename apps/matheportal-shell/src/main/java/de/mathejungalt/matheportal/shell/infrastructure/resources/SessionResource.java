package de.mathejungalt.matheportal.shell.infrastructure.resources;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

import de.mathejungalt.matheportal.shell.domain.model.AccessTokenRequest;

/**
 * SessionResource
 */
@Path("/api/session")
public class SessionResource implements SessionApi {

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
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getLoginUrl'");
    }

    @Override
    public Response reloadSession() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'reloadSession'");
    }

}
