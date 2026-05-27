package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.apache.commons.lang3.StringUtils;

import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.authsessions.api.exceptions.InvalidJWTException;
import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentials;
import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentialsProvider;
import de.mathejungalt.matheportal.shell.domain.exception.LoginSecurityException;
import de.mathejungalt.matheportal.shell.domain.restclientutils.NonceGenerator;

/**
 * LoginService.
 */
@ApplicationScoped
public class LoginService {

    @ConfigProperty(name = "session.idle.timeout")
    int sessionIdleTimeoutMinutes;

    @Inject
    NonceGenerator nonceGenerator;

    @Inject
    OAuthClientCredentialsProvider clientCredentialsProvider;

    @Inject
    ExchangeAccessTokenForJwtDelegate exchangeAccessTokenForJwtService;

    @Inject
    SessionFacade sessionFacade;

    /**
     * Erzeugt eine Session.
     *
     * @param accessToken String
     * @return SessionDto
     * @throws LoginSecurityException wenn das nonce verändert wurde oder das JWT ungültig ist
     */
    public SessionDto login(final String accessToken) throws LoginSecurityException {

        final String nonce = nonceGenerator.generateNonce();

        final OAuthClientCredentials clientCredentials = clientCredentialsProvider.getClientCredentials(nonce);

        final ExchangeTokenResponse exchangeTokenResponse = exchangeAccessTokenForJwtService
                .exchangeTheAccessToken(clientCredentials, accessToken);

        if (!nonce.equals(exchangeTokenResponse.getNonce())) {
            final String message = "Security violation beim Login: zurückgesendetes nonce stimmt nicht: erwartet="
                    + StringUtils.abbreviate(nonce, 11) + ", aktuell="
                    + StringUtils.abbreviate(exchangeTokenResponse.getNonce(), 11);
            throw new LoginSecurityException(message);
        }

        try {

            return sessionFacade.createSession(exchangeTokenResponse.getJwt(), sessionIdleTimeoutMinutes);

        } catch (final InvalidJWTException e) {
            throw new LoginSecurityException(
                    "Security violation beim Login: vom IAM geliefertes JWT konnte nicht validiert werden", e);
        }
    }
}
