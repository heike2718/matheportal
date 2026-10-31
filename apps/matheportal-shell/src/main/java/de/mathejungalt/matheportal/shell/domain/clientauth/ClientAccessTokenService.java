package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response.Status;

import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderHttpException;

/**
 * ClientAccessTokenService.
 */
@RequestScoped
public class ClientAccessTokenService {

    @Inject
    OAuthClientCredentialsProvider clientCredentialsProvider;

    @Inject
    InitAccessTokenDelegate initAccessTokenDelegate;

    /**
     * Holt ein accessToken für den Authentification-Flow.
     *
     * @param nonce String muss ungeändert wieder zurückkommen.
     * @return String das accessToken.
     * @throws IamClientException im Fehlerfall
     */
    public String orderAccessToken(final String nonce) throws AuthproviderHttpException {

        final OAuthClientCredentials credentials = clientCredentialsProvider.getClientCredentials(nonce);
        final OauthClientAccessToken accessToken = initAccessTokenDelegate.authenticateClient(credentials);

        if (!nonce.equals(accessToken.getNonce())) {
            final String message = "Security Threat: zurückgesendetes nonce stimmt nicht: erwartet=" + nonce
                    + ", aktuell=" + accessToken.getNonce();
            throw new AuthproviderHttpException(Status.BAD_GATEWAY.getStatusCode(), message);
        }

        return accessToken.getAccessToken();
    }
}
