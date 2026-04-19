package de.mathejungalt.matheportal.shell.domain.login;

import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.mathejungalt.matheportal.shell.domain.clientauth.ClientAccessTokenService;
import de.mathejungalt.matheportal.shell.domain.generated.AuthUrlResponse;

/**
 * AuthproviderUrlService.
 */
@RequestScoped
public class AuthproviderUrlService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthproviderUrlService.class);

    @ConfigProperty(name = "auth-app.url")
    String authAppUrl;

    @ConfigProperty(name = "public-redirect-url")
    String publicRedirectUrl;

    @Inject
    ClientAccessTokenService clientAccessTokenService;

    /**
     * Gib die redirect url zum Login zurück.
     *
     * @return AuthUrlResponse
     */
    public AuthUrlResponse getLoginUrl() {

        final String nonce = UUID.randomUUID().toString();
        final String accessToken = clientAccessTokenService.orderAccessToken(nonce);

        final String url = authAppUrl + "login?accessToken=" + accessToken + "&state=login&redirectUrl="
                + publicRedirectUrl;

        LOGGER.info("loginUrl={}", url);

        return new AuthUrlResponse(url);
    }

}
