package de.mathejungalt.matheportal.shell.domain.login;

import jakarta.enterprise.context.RequestScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

}
