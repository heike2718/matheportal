package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.matheportal.shell.domain.clientauth.ClientAccessTokenService;
import de.mathejungalt.matheportal.shell.domain.generated.AuthUrlResponse;
import de.mathejungalt.matheportal.shell.domain.restclientutils.NonceGenerator;

import lombok.extern.slf4j.Slf4j;

/**
 * AuthproviderUrlService.
 */
@Slf4j
@RequestScoped
public class AuthproviderUrlService {

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

        log.info("loginUrl={}", url);

        return new AuthUrlResponse(url);
    }

    /**
     * Gibt die redirect url zum Signup zurück
     *
     * @return AuthUrlResponse
     */
    public AuthUrlResponse getSignupUrl() {

        final String nonce = nonceGenerator.generateNonce();
        final String accessToken = clientAccessTokenService.orderAccessToken(nonce);

        final String url = authAppUrl + "signup?accessToken=" + accessToken + "&state=signup&redirectUrl="
                + clientRedirectUrl;

        log.info("loginUrl={}", url);

        return new AuthUrlResponse(url);
    }

}
