package de.mathejungalt.matheportal.shell.domain.clientauth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.mathejungalt.matheportal.shell.domain.exception.ClientAuthException;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

/**
 * ClientAccessTokenService.
 */
@RequestScoped
public class ClientAccessTokenService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ClientAccessTokenService.class);

    @Inject
    OAuthClientCredentialsProvider clientCredentialsProvider;

    @Inject
    InitAccessTokenDelegate initAccessTokenDelegate;

    /**
     * Holt ein accessToken für den Authentification-Flow.
     * 
     * @param nonce String muss ungeändert wieder zurückkommen.
     * @return String das accessToken.
     */
    public String orderAccessToken(final String nonce) {

        final OAuthClientCredentials credentials = clientCredentialsProvider.getClientCredentials(nonce);
        final OauthClientAccessToken accessToken = initAccessTokenDelegate.authenticateClient(credentials);

        if (!nonce.equals(accessToken.getNonce())) {
            LOGGER
                    .warn("Security Threat: zurückgesendetes nonce stimmt nicht: erwartet '{}' aktuell '{}'", nonce,
                            accessToken.getNonce());
            throw new ClientAuthException();
        }

        return accessToken.getAccessToken();
    }
}
