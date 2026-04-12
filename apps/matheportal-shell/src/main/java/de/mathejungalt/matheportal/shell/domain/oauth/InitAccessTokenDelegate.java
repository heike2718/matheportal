package de.mathejungalt.matheportal.shell.domain.oauth;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.mathejungalt.matheportal.shell.infrastructure.restclient.AuthproviderRestClient;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * InitAccessTokenDelegate.
 */
@ApplicationScoped
public class InitAccessTokenDelegate {

    private static final Logger LOGGER = LoggerFactory.getLogger(InitAccessTokenDelegate.class);

    @Inject
    @RestClient
    AuthproviderRestClient authproviderRestClient;

}
