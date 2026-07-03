package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * MinikaenguruConflictExceptionMapper
 */
@Slf4j
@Provider
@Priority(ExceptionMapperPriorities.APPLICATION)
public class MinikaenguruConflictExceptionMapper implements ExceptionMapper<MinikaenguruConflictException> {

    @Override
    public Response toResponse(final MinikaenguruConflictException exception) {

        log.error(exception.getMessage(), exception);

        final ErrorResponse errorResponse = new ErrorResponse().message(exception.getMessage());

        return Response.status(Status.CONFLICT).entity(errorResponse).build();
    }
}
