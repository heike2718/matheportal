package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.core.Response.Status;

import org.eclipse.microprofile.faulttolerance.exceptions.TimeoutException;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import org.jboss.resteasy.reactive.ClientWebApplicationException;

import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentials;
import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderHttpException;
import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderRestClient;

import lombok.extern.slf4j.Slf4j;

/**
 * ExchangeAccessTokenForJwtDelegate.
 */
@ApplicationScoped
@Slf4j
public class ExchangeAccessTokenForJwtDelegate {

    @Inject
    @RestClient
    AuthproviderRestClient authproviderRestClient;

    /**
     * ExchangeAccessTokenForJwtDelegate.
     */
    public ExchangeAccessTokenForJwtDelegate() {
        super();
        // wegen JavaDoc strict
    }

    /**
     * Holt sich mit dem accessToken das JWT.
     *
     * @param clientCredentials OAuthClientCredentials
     * @param accessToken       String
     * @return ExchangeTokenResponse
     */
    public ExchangeTokenResponse exchangeTheAccessToken(final OAuthClientCredentials clientCredentials,
            final String accessToken) {

        try {
            final ExchangeTokenResponse exchangeTokenResponse = authproviderRestClient
                    .exchangeOneTimeTokenWithJwt(accessToken, clientCredentials);

            if (exchangeTokenResponse == null) {
                throw new AuthproviderHttpException(Status.BAD_GATEWAY.getStatusCode(),
                        "IAM antwortet mit unerwarteter response payload 'null' beim Tausch des Tokens");
            }

            if (exchangeTokenResponse.getNonce() == null
                    || !clientCredentials.getNonce().equals(exchangeTokenResponse.getNonce())) {
                throw new AuthproviderHttpException(Status.BAD_GATEWAY.getStatusCode(),
                        "IAM-Antwort hat das nonce geaendert: erwartetes nonce=" + clientCredentials.getNonce()
                                + ", aktuell=" + exchangeTokenResponse.getNonce());
            }

            if (exchangeTokenResponse.getJwt() == null) {
                log.error("es wurde kein jwt zurueckgegeben");
                throw new AuthproviderHttpException(Status.BAD_GATEWAY.getStatusCode(),
                        "IAM-Antwort enthält nicht die erwarteten Felder: jwt fehlt");
            }

            return exchangeTokenResponse;

        } catch (final TimeoutException e) {
            log
                    .error("Timeout beim Tausch des Tokens - clientId={}: {}", clientCredentials.getClientId(),
                            e.getMessage(), e);
            throw new AuthproviderHttpException(Status.GATEWAY_TIMEOUT.getStatusCode(),
                    "Timeout beim Tausch des Tokens");
        } catch (ClientWebApplicationException | ProcessingException e) {
            log
                    .error("{} beim beim Tausch des Tokens - clientId={}: {}", e.getClass(),
                            clientCredentials.getClientId(), e.getMessage(), e);
            throw new AuthproviderHttpException(Status.BAD_GATEWAY.getStatusCode(),
                    "IAM antwortet mit unerwarteter response payload beim Tausch des Tokens");
        }
    }
}
