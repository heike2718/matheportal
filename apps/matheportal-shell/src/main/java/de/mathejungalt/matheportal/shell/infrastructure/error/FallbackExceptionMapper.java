package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Request;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.matheportal.shell.domain.generated.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * FallbackExceptionMapper.
 */
@Slf4j
@Provider
@Priority(ExceptionMapperPriorities.FALLBACK)
public class FallbackExceptionMapper implements ExceptionMapper<RuntimeException> {

    @Context
    UriInfo uriInfo;

    @Context
    Request request;

    @Override
    public Response toResponse(final RuntimeException exception) {

        final String method = request.getMethod();
        final String url = uriInfo.getPath();

        log.error("Unerwarteter Fehler bei {} {}: {}", method, url, exception.getMessage(), exception);

        final ErrorResponse errorResponseDto = new ErrorResponse().message("""
                Es ist ein technischer Fehler aufgetreten.
                Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.""");

        return Response.serverError().entity(errorResponseDto).build();
    }
}
