package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.core.Response.Status;

import org.eclipse.microprofile.faulttolerance.exceptions.TimeoutException;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import org.jboss.resteasy.reactive.ClientWebApplicationException;

import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderHttpException;
import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderRestClient;

import lombok.extern.slf4j.Slf4j;

/**
 * InitAccessTokenDelegate.
 */
@ApplicationScoped
@Slf4j
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
            throws AuthproviderHttpException {

        try {

            final OauthClientAccessToken token = authproviderRestClient.authenticateClient(credentials);

            if (token == null) {
                throw new AuthproviderHttpException(Status.BAD_GATEWAY.getStatusCode(),
                        "IAM antwortet mit unerwarteter response payload 'null' beim Authentifizieren des Clients");
            }

            if (token.getNonce() == null || !credentials.getNonce().equals(token.getNonce())) {
                throw new AuthproviderHttpException(Status.BAD_GATEWAY.getStatusCode(),
                        "IAM-Antwort hat das nonce geaendert: erwartetes nonce=" + credentials.getNonce() + ", aktuell="
                                + token.getNonce());
            }

            if (token.getAccessToken() == null) {
                log.error("es wurde kein access token generiert");
                throw new AuthproviderHttpException(Status.BAD_GATEWAY.getStatusCode(),
                        "IAM-Antwort enthält nicht die erwarteten Felder: accessToken fehlt");
            }
            return token;
        } catch (final TimeoutException e) {
            log.error("Timeout beim Authentifizieren des Clients {}: {}", credentials.getClientId(), e.getMessage(), e);
            throw new AuthproviderHttpException(Status.GATEWAY_TIMEOUT.getStatusCode(),
                    "Timeout beim Authentifizieren des Clients");
        } catch (ClientWebApplicationException | ProcessingException e) {
            log
                    .error("{} beim Authentifizieren des Clients {}: {}", e.getClass(), credentials.getClientId(),
                            e.getMessage(), e);
            throw new AuthproviderHttpException(Status.BAD_GATEWAY.getStatusCode(),
                    "IAM antwortet mit unerwarteter response payload beim Authentifizieren des Clients");
        }
    }
}
