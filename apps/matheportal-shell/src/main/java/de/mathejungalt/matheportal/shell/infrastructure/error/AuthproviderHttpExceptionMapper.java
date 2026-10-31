package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.matheportal.shell.domain.generated.ErrorResponse;
import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderHttpException;

import lombok.extern.slf4j.Slf4j;

/**
 * AuthproviderHttpExceptionMapper.
 */
@Slf4j
@Provider
@Priority(ExceptionMapperPriorities.IAM_CLIENT)
public class AuthproviderHttpExceptionMapper implements ExceptionMapper<AuthproviderHttpException> {

    private static final String MESSAGE = """
            Login oder Anlegen eines Benutzerkontos sind zur Zeit leider \
            nicht möglich. Bitte senden Sie eine Mail und versuchen es \
            später noch einmal.\
            """;

    @Override
    public Response toResponse(final AuthproviderHttpException exception) {
        log.error(exception.getMessage(), exception);
        return Response.status(exception.getStatus()).entity(new ErrorResponse(MESSAGE)).build();
    }

}
