package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.mathejungalt.matheportal.shell.domain.clientauth.ClientAccessTokenService;
import de.mathejungalt.matheportal.shell.domain.generated.AuthUrlResponse;
import de.mathejungalt.matheportal.shell.domain.restclientutils.NonceGenerator;

/**
 * AuthproviderUrlService.
 */
@RequestScoped
public class AuthproviderUrlService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthproviderUrlService.class);

    @ConfigProperty(name = "auth-app.url")
    String authAppUrl;

    @ConfigProperty(name = "client.redirect.url")
    String clientRedirectUrl;

    @Inject
    ClientAccessTokenService clientAccessTokenService;

    @Inject
    NonceGenerator nonceGenerator;

    /**
     * Gib die redirect url zum Login zurück.
     *
     * @return AuthUrlResponse
     */
    public AuthUrlResponse getLoginUrl() {

        final String nonce = nonceGenerator.generateNonce();
        final String accessToken = clientAccessTokenService.orderAccessToken(nonce);

        final String url = authAppUrl + "login?accessToken=" + accessToken + "&state=login&redirectUrl="
                + clientRedirectUrl;

        LOGGER.info("loginUrl={}", url);

        return new AuthUrlResponse(url);
    }

}
