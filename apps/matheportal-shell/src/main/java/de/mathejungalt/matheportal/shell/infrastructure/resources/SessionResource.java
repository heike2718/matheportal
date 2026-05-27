package de.mathejungalt.matheportal.shell.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;

import de.mathejungalt.authsessions.api.SessionConstants;
import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.api.UserDto;
import de.mathejungalt.matheportal.shell.domain.generated.AccessTokenRequest;
import de.mathejungalt.matheportal.shell.domain.generated.AuthUrlResponse;
import de.mathejungalt.matheportal.shell.domain.login.AuthproviderUrlService;
import de.mathejungalt.matheportal.shell.domain.login.LoginService;
import de.mathejungalt.matheportal.shell.infrastructure.generated.SessionApi;

/**
 * SessionResource.
 */
@Path("/api/session")
public final class SessionResource implements SessionApi {

    @Inject
    AuthproviderUrlService authproviderUrlService;

    @Inject
    LoginService loginService;

    @Override
    public Response createSession(@Valid @NotNull final AccessTokenRequest accessTokenRequest) {
        final SessionDto sessionDto = loginService.login(accessTokenRequest.getIdToken());

        final UserDto user = new UserDto(sessionDto.getAuthenticatedUser().getFullName(),
                sessionDto.getAuthenticatedUser().getRoles());

        final NewCookie sessionCookie = new NewCookie.Builder(SessionConstants.SESSION_COOKIE_NAME)
                .value(sessionDto.getSessionId())
                .path("/matheportal")
                .httpOnly(true)
                .secure(true)
                .sameSite(NewCookie.SameSite.LAX)
                .maxAge(-1)
                .build();

        return Response.ok(user).cookie(sessionCookie).build();
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
