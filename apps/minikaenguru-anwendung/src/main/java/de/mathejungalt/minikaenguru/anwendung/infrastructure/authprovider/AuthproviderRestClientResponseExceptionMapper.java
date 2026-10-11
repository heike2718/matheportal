package de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider;

import java.text.MessageFormat;

import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.rest.client.ext.ResponseExceptionMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * AuthproviderResponseExceptionMapper.
 */
@Slf4j
public class AuthproviderRestClientResponseExceptionMapper implements ResponseExceptionMapper<Throwable> {

    private static final String MESSAGE_FORMAT_PROCESSING_EXCEPTION = """
            authprovider hat bei http-Status {0} keine vertragsgemaesse Fehlerantwort geliefert. \
            Erwartet wurde MessagePayload. Die response payload war leer oder konnte nicht entsprechend deserialisiert werden.
            """;

    @Override
    public Throwable toThrowable(final Response response) {

        final int status = response.getStatus();

        switch (status) {
        case 400:
        case 500:
            return mapToExceptionWithMessagePayload(response);
        case 401:
            return new AuthproviderHttpException(status,
                    "Konfiguration der Kommunikation mit authprovider ist falsch. client.id und client.secret prüfen.");
        case 403:
            return new AuthproviderHttpException(status,
                    "client.id ist im authprovider nicht korrekt konfiguriert. Dort matheportal.minikaenguru.clientid prüfen.");
        case 404:
            return new AuthproviderHttpException(status, "Diese Resource gibt es nicht.");
        case 503:
        case 504:
            final String message = "Authprovider kann nicht erreicht werden.";
            return new AuthproviderHttpException(status, message);
        default:
            return new AuthproviderHttpException(status,
                    "authprovider antwortet mit unerwartetem http-Status " + status);
        }
    }

    AuthproviderHttpException mapToExceptionWithMessagePayload(final Response response) {

        final int status = response.getStatus();

        try {

            final MessagePayload messagePayload = response.readEntity(MessagePayload.class);
            if (messagePayload != null) {
                return new AuthproviderHttpException(status, messagePayload.getMessage());
            }
            final String message = MessageFormat.format(MESSAGE_FORMAT_PROCESSING_EXCEPTION, status);
            return new AuthproviderHttpException(status, message);
        } catch (final ProcessingException e) {

            final String message = MessageFormat.format(MESSAGE_FORMAT_PROCESSING_EXCEPTION, status);
            return new AuthproviderHttpException(status, message);

        }
    }

}
