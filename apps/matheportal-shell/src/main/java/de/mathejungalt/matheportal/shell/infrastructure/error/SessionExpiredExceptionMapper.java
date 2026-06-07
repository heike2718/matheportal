package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.authsessions.api.exceptions.SessionExpiredException;
import de.mathejungalt.matheportal.shell.domain.session.SessionCookieAdapter;

/**
 * SessionExpiredExceptionMapper.
 */
@Provider
@Priority(ExceptionMapperPriorities.SESSION)
public class SessionExpiredExceptionMapper implements ExceptionMapper<SessionExpiredException> {

    @Inject
    SessionCookieAdapter sessionCookieAdapter;

    @Override
    public Response toResponse(final SessionExpiredException exception) {

        final NewCookie expiredCookie = sessionCookieAdapter.createExpiredSessionCookie();
        return Response.status(Status.UNAUTHORIZED).cookie(expiredCookie).build();
    }

}
