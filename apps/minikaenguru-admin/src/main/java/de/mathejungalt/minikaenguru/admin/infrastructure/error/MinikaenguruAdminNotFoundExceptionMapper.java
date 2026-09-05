package de.mathejungalt.minikaenguru.admin.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.minikaenguru.admin.domain.exception.MinikaenguruAdminNotFoundException;
import de.mathejungalt.minikaenguru.admin.domain.generated.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * MinikaenguruAdminNotFoundExceptionMapper.
 */
@Slf4j
@Provider
@Priority(ExceptionMapperPriorities.APPLICATION)
public class MinikaenguruAdminNotFoundExceptionMapper implements ExceptionMapper<MinikaenguruAdminNotFoundException> {

    @Override
    public Response toResponse(final MinikaenguruAdminNotFoundException exception) {
        log.error(exception.getMessage());

        final ErrorResponse errorResponse = new ErrorResponse().message("Die Ressource gibt es nicht oder nicht mehr.");
        return Response.status(Status.NOT_FOUND).entity(errorResponse).build();
    }
}
