package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.matheportal.shell.domain.exception.IamClientException;
import de.mathejungalt.matheportal.shell.domain.generated.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * IamClientExceptionMapper.
 */
@Slf4j
@Provider
@Priority(ExceptionMapperPriorities.IAM_CLIENT)
public final class IamClientExceptionMapper implements ExceptionMapper<IamClientException> {

    private static final String MESSAGE = """
            Login oder Anlegen eines Benutzerkontos sind zur Zeit leider \
            nicht möglich. Bitte senden Sie eine Mail und versuchen es \
            später noch einmal.\
            """;

    @Override
    public Response toResponse(final IamClientException exception) {

        log.error(exception.getMessage(), exception);

        final Status status = switch (exception.getErrorType()) {
        case IAM_UNREACHABLE -> Status.SERVICE_UNAVAILABLE;
        case IAM_ERROR_RESPONSE, IAM_CONTRACT_VIOLATION, SECURITY_VIOLATION -> Status.INTERNAL_SERVER_ERROR;
        };

        return Response.status(status).entity(new ErrorResponse(MESSAGE)).build();

    }

}
