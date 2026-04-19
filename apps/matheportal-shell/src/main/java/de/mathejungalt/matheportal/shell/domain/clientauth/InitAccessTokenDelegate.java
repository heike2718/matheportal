package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.fasterxml.jackson.core.JsonParseException;

import de.mathejungalt.matheportal.shell.domain.exception.IamResponseException;
import de.mathejungalt.matheportal.shell.domain.exception.RestCommunicationFailedException;
import de.mathejungalt.matheportal.shell.domain.exception.RestResponseProcessingException;
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
     * @throws IamResponseException             wenn IAM mit einem Statuscode 4xx
     *                                          oder 5xx antwortet.
     * @throws RestResponseProcessingException  wenn die Entity in der Response
     *                                          anders als erwartet aussieht.
     * @throws RestCommunicationFailedException wenn IAM nicht erreichbar ist.
     */
    public OauthClientAccessToken authenticateClient(final OAuthClientCredentials credentials)
            throws IamResponseException, RestResponseProcessingException, RestCommunicationFailedException {

        try (Response authResponse = authproviderRestClient.authenticateClient(credentials)) {
            final OauthClientAccessToken token = OauthClientAccessToken
                    .from(authResponse.readEntity(ResponsePayload.class));
            if (token.getNonce() == null || token.getAccessToken() == null) {
                throw new RestResponseProcessingException(
                        "IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder accessToken fehlen");
            }
            return token;
        } catch (final WebApplicationException e) {

            if (e.getCause() instanceof JsonParseException) {
                final String msg = "Kommunikationsfehler beim Anfordern eines client-accessTokens (response payload ist invalides json): "
                        + e.getMessage();
                throw new RestResponseProcessingException(msg, e.getCause());
            }

            final Response errorResponse = e.getResponse();
            final int status = errorResponse.getStatus();
            final ResponsePayload responsePayload = errorResponse.readEntity(ResponsePayload.class);
            final String msg = "IAM antwortete mit Status " + status;
            throw new IamResponseException(msg, status, responsePayload);
        } catch (final ProcessingException e) {
            final String msg = "Kommunikationsfehler beim Anfordern eines client-accessTokens: " + e.getMessage();
            throw new RestCommunicationFailedException(msg, e);
        }
    }
}
