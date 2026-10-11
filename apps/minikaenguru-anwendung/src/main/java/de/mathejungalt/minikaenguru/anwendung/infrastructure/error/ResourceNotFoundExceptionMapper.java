package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.ResourceNotFoundException;

/**
 * ResourceNotFoundExceptionMapper.
 */
@Provider
@Priority(ExceptionMapperPriorities.APPLICATION)
public class ResourceNotFoundExceptionMapper implements ExceptionMapper<ResourceNotFoundException> {

    @Override
    public Response toResponse(final ResourceNotFoundException exception) {
        return Response.status(Status.NOT_FOUND).build();
    }

}
