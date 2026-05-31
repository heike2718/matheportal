package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.fasterxml.jackson.core.JsonParseException;

import de.mathejungalt.matheportal.shell.domain.clientauth.IamClientErrorType;
import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentials;
import de.mathejungalt.matheportal.shell.domain.clientauth.ResponsePayload;
import de.mathejungalt.matheportal.shell.domain.exception.IamClientException;
import de.mathejungalt.matheportal.shell.domain.exception.IamUnreachableException;
import de.mathejungalt.matheportal.shell.domain.restclientutils.RestClientUtils;
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
    // CPD-OFF
    public ExchangeTokenResponse exchangeTheAccessToken(final OAuthClientCredentials clientCredentials,
            final String accessToken) {

        try (Response authResponse = authproviderRestClient
                .exchangeOneTimeTokenWithJwt(accessToken, clientCredentials)) {

            final ExchangeTokenResponse responsePayload = ExchangeTokenResponse
                    .from(authResponse.readEntity(ResponsePayload.class));

            if (responsePayload.getNonce() == null || responsePayload.getJwt() == null) {
                throw new IamClientException(
                        "IAM-Antwort enthält nicht die erwarteten Felder: nonce und/oder jwt fehlen",
                        IamClientErrorType.IAM_CONTRACT_VIOLATION);
            }

            return responsePayload;

        } catch (final WebApplicationException e) {

            if (e.getCause() instanceof JsonParseException) {
                final String msg = "IAM-Antwort ist invalides json";
                throw new IamClientException(msg, e, IamClientErrorType.IAM_CONTRACT_VIOLATION);
            }

            throw RestClientUtils.mapToIamClientException(e);
        } catch (final ProcessingException e) {

            final Throwable cause = e.getCause();

            if (cause == null) {
                final String message = "IAM-Antwort kann nicht deserialisiert werden - wahrscheinlich falscher MIME-Type)";
                throw new IamClientException(message, e, IamClientErrorType.IAM_CONTRACT_VIOLATION);
            }

            final String msg = "Kommunikationsfehler beim Tauschen des accessTokens gegen JWT";
            throw new IamUnreachableException(msg, e);
        }
        // CPD-ON
    }

}
