package de.mathejungalt.matheportal.shell.domain.restclientutils;

import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import de.mathejungalt.matheportal.shell.domain.clientauth.IamClientErrorType;
import de.mathejungalt.matheportal.shell.domain.clientauth.ResponsePayload;
import de.mathejungalt.matheportal.shell.domain.exception.IamClientException;

/**
 * RestClientUtils.
 */
public final class RestClientUtils {

    /**
     * RestClientUtils.
     */
    private RestClientUtils() {
        super();
    }

    /**
     * Mapped eine bei einem RestClient-Aufruf auftretende WebApplicationException in eine IamClientException.
     *
     * @param webApplicationException WebApplicationException
     * @return IamClientException
     */
    public static IamClientException mapToIamClientException(final WebApplicationException webApplicationException) {
        int status = 0;
        try (Response errorResponse = webApplicationException.getResponse();) {
            status = errorResponse.getStatus();
            final ResponsePayload responsePayload = errorResponse.readEntity(ResponsePayload.class);

            return new IamClientException(
                    "IAM antwortet mit Status " + status + " - " + responsePayload.getMessagePayload().getMessage(),
                    webApplicationException, IamClientErrorType.IAM_ERROR_RESPONSE);
        } catch (final ProcessingException e) {
            throw new IamClientException("IAM antwortet mit Status " + status + " ohne lesbaren Payload", e,
                    IamClientErrorType.IAM_CONTRACT_VIOLATION);
        }
    }
}
