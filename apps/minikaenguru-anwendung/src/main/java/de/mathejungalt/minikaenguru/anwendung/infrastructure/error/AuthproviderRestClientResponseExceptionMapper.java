package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import java.text.MessageFormat;

import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.rest.client.ext.ResponseExceptionMapper;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.AuthproviderHttpException;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.restclient.MessagePayload;

/**
 * AuthproviderResponseExceptionMapper.
 */
public class AuthproviderRestClientResponseExceptionMapper implements ResponseExceptionMapper<Throwable> {

    private static final String MESSAGE_FORMAT_PROCESSING_EXCEPTION = """
            authprovider hat bei http-Status {0} keine vertragsgemaesse Fehlerantwort geliefert. \
            Erwartet wurde MessagePayload. Die response payload war leer oder konnte nicht entsprechend deserialisiert werden.
            """;

    @Override
    public Throwable toThrowable(final Response response) {

        final int status = response.getStatus();

        if (status >= 300 && status < 400) {
            return new AuthproviderHttpException(status, "autprovider sendet redirect mit status " + status);
        }

        switch (status) {
        case 400:
        case 500:
            return mapToExceptionWithMessagePayload(response);
        case 401:
            return new AuthproviderHttpException(status, "Diese Resource gibt es nicht");
        case 503:
        case 504:
            return new AuthproviderHttpException(status, "Authprovider kann nicht erreicht werden");
        default:
            return new AuthproviderHttpException(status, "authprovider antwortet mit unerwartetem http-Status");
        }
    }

    AuthproviderHttpException mapToExceptionWithMessagePayload(final Response response) {

        final int status = response.getStatus();

        try {

            final MessagePayload messagePayload = response.readEntity(MessagePayload.class);
            return new AuthproviderHttpException(status, messagePayload.getMessage());

        } catch (final ProcessingException e) {

            final String message = MessageFormat.format(MESSAGE_FORMAT_PROCESSING_EXCEPTION, status);
            return new AuthproviderHttpException(status, message);

        }
    }

}
