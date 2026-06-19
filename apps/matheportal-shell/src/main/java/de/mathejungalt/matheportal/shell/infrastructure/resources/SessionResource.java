package de.mathejungalt.matheportal.shell.infrastructure.resources;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.api.UserDto;
import de.mathejungalt.matheportal.shell.domain.generated.AccessTokenRequest;
import de.mathejungalt.matheportal.shell.domain.login.LoginService;
import de.mathejungalt.matheportal.shell.domain.logout.LogoutService;
import de.mathejungalt.matheportal.shell.domain.session.ReloadSessionService;
import de.mathejungalt.matheportal.shell.domain.session.SessionCookieAdapter;
import de.mathejungalt.matheportal.shell.infrastructure.generated.SessionApi;

/**
 * SessionResource.
 */
@Path("/api/session")
public final class SessionResource implements SessionApi {

    @Inject
    SessionCookieAdapter sessionCookieAdapter;

    @Inject
    LoginService loginService;

    @Inject
    ReloadSessionService reloadSessionService;

    @Inject
    LogoutService logoutService;

    @Override
    public Response createSession(@Valid @NotNull final AccessTokenRequest accessTokenRequest) {
        final SessionDto sessionDto = loginService.login(accessTokenRequest.getIdToken());

        final UserDto user = new UserDto(sessionDto.getAuthenticatedUser().getFullName(),
                sessionDto.getAuthenticatedUser().getBerechtigungen());

        final NewCookie sessionCookie = sessionCookieAdapter.createSessionCookie(sessionDto.getSessionId());

        return Response.ok(user).cookie(sessionCookie).build();
    }

    @Override
    public Response deleteSession() {

        logoutService.logout();

        final NewCookie invalidatedCookie = sessionCookieAdapter.createExpiredSessionCookie();

        return Response.status(Status.NO_CONTENT).cookie(invalidatedCookie).build();

    }

    @Override
    public Response reloadSession() {
        final UserDto userDto = reloadSessionService.reloadSession();

        return Response.ok(userDto).build();
    }
}
