package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.mathejungalt.matheportal.shell.domain.exception.IamClientException;
import de.mathejungalt.matheportal.shell.domain.generated.ErrorResponse;

/**
 * IamClientExceptionMapper.
 */
@Provider
@Priority(ExceptionMapperPriorities.IAM_CLIENT)
public final class IamClientExceptionMapper implements ExceptionMapper<IamClientException> {

    private static final String MESSAGE = """
            Login oder Anlegen eines Benutzerkontos sind zur Zeit leider \
            nicht möglich. Bitte senden Sie eine Mail und versuchen es \
            später noch einmal.\
            """;

    private static final Logger LOGGER = LoggerFactory.getLogger(IamClientExceptionMapper.class);

    @Override
    public Response toResponse(final IamClientException exception) {

        LOGGER.error(exception.getMessage(), exception);

        final Status status = switch (exception.getErrorType()) {
        case IAM_UNREACHABLE -> Status.SERVICE_UNAVAILABLE;
        case IAM_ERROR_RESPONSE, IAM_CONTRACT_VIOLATION, SECURITY_VIOLATION -> Status.INTERNAL_SERVER_ERROR;
        };

        return Response.status(status).entity(new ErrorResponse(MESSAGE)).build();

    }

}
