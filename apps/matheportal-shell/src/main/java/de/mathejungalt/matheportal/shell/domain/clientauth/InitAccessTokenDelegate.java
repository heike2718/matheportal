package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.fasterxml.jackson.core.JsonParseException;

import de.mathejungalt.matheportal.shell.domain.exception.IamClientException;
import de.mathejungalt.matheportal.shell.domain.exception.IamUnreachableException;
import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderRestClient;

/**
 * InitAccessTokenDelegate.
 */
@ApplicationScoped
public class InitAccessTokenDelegate {

    @Inject
    @RestClient
    AuthproviderRestClient authproviderRestClient;

    /**
     * Holt sich ein accessToken vom IAM.
     *
     * @param credentials OAuthClientCredentials
     * @return OauthClientAccessToken
     * @throws IamClientException wenn irgendetwas schief lief.
     */
    public OauthClientAccessToken authenticateClient(final OAuthClientCredentials credentials)
            throws IamClientException {

        try (Response authResponse = authproviderRestClient.authenticateClient(credentials)) {
            final OauthClientAccessToken token = OauthClientAccessToken
                    .from(authResponse.readEntity(ResponsePayload.class));
            if (token.getNonce() == null || token.getAccessToken() == null) {
                throw new IamClientException(
                        "IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder accessToken fehlen",
                        IamClientErrorType.IAM_CONTRACT_VIOLATION);
            }
            return token;
        } catch (final WebApplicationException e) {

            if (e.getCause() instanceof JsonParseException) {
                final String msg = "IAM-Antwort ist invalides json";
                throw new IamClientException(msg, e.getCause(), IamClientErrorType.IAM_CONTRACT_VIOLATION);
            }

            final Response errorResponse = e.getResponse();
            final int status = errorResponse.getStatus();
            final ResponsePayload responsePayload = readPayloadOrThrow(errorResponse);
            throw new IamClientException(
                    "IAM antwortet mit Status " + status + " - " + responsePayload.getMessagePayload().getMessage(), e,
                    IamClientErrorType.IAM_ERROR_RESPONSE);
        } catch (final ProcessingException e) {

            final Throwable cause = e.getCause();

            if (cause == null) {
                final String message = "IAM-Antwort kann nicht deserialisiert werden - wahrscheinlich falscher MIME-Type)";
                throw new IamClientException(message, e, IamClientErrorType.IAM_CONTRACT_VIOLATION);
            }

            final String msg = "Kommunikationsfehler beim Anfordern eines client-accessTokens";
            throw new IamUnreachableException(msg, e);
        }
    }

    private ResponsePayload readPayloadOrThrow(final Response response) {
        try {
            final ResponsePayload payload = response.readEntity(ResponsePayload.class);
            if (payload == null || payload.getMessagePayload() == null) {
                throw new IamClientException(
                        "IAM antwortet mit Status " + response.getStatus() + " ohne lesbaren Payload",
                        IamClientErrorType.IAM_CONTRACT_VIOLATION);
            }
            return payload;
        } catch (final ProcessingException e) {
            throw new IamClientException("IAM antwortet mit Status " + response.getStatus() + " ohne lesbaren Payload",
                    e, IamClientErrorType.IAM_CONTRACT_VIOLATION);
        }
    }
}
