package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.authsessions.api.SessionValidationFailedDto;
import de.mathejungalt.authsessions.api.exceptions.SessionValidationFailedException;
import de.mathejungalt.matheportal.shell.domain.session.SessionCookieAdapter;

/**
 * SessionValidationFailedExceptionMapper.
 */
@Provider
@Priority(ExceptionMapperPriorities.SESSION)
public class SessionValidationFailedExceptionMapper implements ExceptionMapper<SessionValidationFailedException> {

    @Inject
    SessionCookieAdapter sessionCookieAdapter;

    @Override
    public Response toResponse(final SessionValidationFailedException exception) {

        final NewCookie expiredCookie = sessionCookieAdapter.createExpiredSessionCookie();
        final SessionValidationFailedDto payload = new SessionValidationFailedDto(exception.getReason());
        return Response.status(Status.UNAUTHORIZED).entity(payload).cookie(expiredCookie).build();
    }
}
