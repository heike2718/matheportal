package de.mathejungalt.matheportal.shell.domain.oauth;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * ClientAccessTokenService.
 */
@RequestScoped
public class ClientAccessTokenService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ClientAccessTokenService.class);

    @Inject
    OAuthClientCredentialsProvider clientCredentialsProvider;

}
