package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.minikaenguru.anwendung.domain.authorization.MinikaenguruAuthorizationException;

/**
 * MinikaenguruAuthorizationExceptionMapper
 */
@Provider
@Priority(ExceptionMapperPriorities.APPLICATION)
public class MinikaenguruAuthorizationExceptionMapper implements ExceptionMapper<MinikaenguruAuthorizationException> {

    @Override
    public Response toResponse(final MinikaenguruAuthorizationException exception) {
        return Response.status(Status.FORBIDDEN).build();
    }

}
