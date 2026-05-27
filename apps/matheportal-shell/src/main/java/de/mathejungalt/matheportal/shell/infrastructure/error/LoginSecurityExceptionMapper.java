package de.mathejungalt.matheportal.shell.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.matheportal.shell.domain.exception.LoginSecurityException;
import de.mathejungalt.matheportal.shell.domain.generated.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * LoginSecurityExceptionMapper.
 */
@Provider
@Priority(ExceptionMapperPriorities.LOGIN)
@Slf4j
public class LoginSecurityExceptionMapper implements ExceptionMapper<LoginSecurityException> {

    @Override
    public Response toResponse(final LoginSecurityException exception) {

        log.error(exception.getMessage(), exception);

        return Response
                .status(Response.Status.UNAUTHORIZED)
                .entity(new ErrorResponse(
                        "Die Anmeldung konnte nicht abgeschlossen werden. Bitte versuchen Sie es später erneut."))
                .build();
    }

}
