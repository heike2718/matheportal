package de.mathejungalt.matheportal.shell.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import de.mathejungalt.matheportal.shell.domain.generated.AuthUrlResponse;
import de.mathejungalt.matheportal.shell.domain.login.AuthproviderUrlService;
import de.mathejungalt.matheportal.shell.infrastructure.generated.AuthurlsApi;

/**
 * AuthurlsResource.
 */
public class AuthurlsResource implements AuthurlsApi {

    @Inject
    AuthproviderUrlService authproviderUrlService;

    @Override
    public Response getLoginUrl() {
        final AuthUrlResponse payload = authproviderUrlService.getLoginUrl();
        return Response.ok(payload).build();
    }

    @Override
    public Response getSignupUrl() {
        final AuthUrlResponse payload = authproviderUrlService.getSignupUrl();
        return Response.ok(payload).build();
    }

}
