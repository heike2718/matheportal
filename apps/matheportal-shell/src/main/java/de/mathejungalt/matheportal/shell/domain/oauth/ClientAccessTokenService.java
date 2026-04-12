package de.mathejungalt.matheportal.shell.domain.oauth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

}
