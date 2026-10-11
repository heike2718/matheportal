package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderHttpException;

import lombok.extern.slf4j.Slf4j;

/**
 * AuthproviderHttpExceptionMapper. Wandelt eine AuthproviderHttpException in einen verständlichen ErrorResponse um.
 * <br>
 * <br>
 * Der authprovider wird zum Laden der Namen der Kollegen bemüht. Der ResponseExceptionMapper sollte dafür sorgen, dass
 */
@Provider
@Priority(ExceptionMapperPriorities.APPLICATION)
@Slf4j
public class AuthproviderHttpExceptionMapper implements ExceptionMapper<AuthproviderHttpException> {

    private static final String GENERAL_SERVER_ERROR_MESSAGE = "Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.";

    @Override
    public Response toResponse(final AuthproviderHttpException exception) {

        if (isUnexpectedStatuscode(exception.getStatus())) {
            log
                    .error("Status {} bei der Kommunikation mit authprovider sollte im SchuleService gefangen und nicht als Exception propagiert werden",
                            exception.getStatus());
            return Response.status(500).entity(new ErrorResponse(GENERAL_SERVER_ERROR_MESSAGE)).build();
        }

        log
                .error("Kommunikation mit authprovider ging schief: http-status={}, message={}", exception.getStatus(),
                        exception.getMessage(), exception);
        return Response.status(500).entity(new ErrorResponse(GENERAL_SERVER_ERROR_MESSAGE)).build();
    }

    boolean isUnexpectedStatuscode(final int status) {

        if (status >= Status.INTERNAL_SERVER_ERROR.getStatusCode()) {
            return true;
        }

        return Status.NOT_FOUND.getStatusCode() == status;
    }

}
