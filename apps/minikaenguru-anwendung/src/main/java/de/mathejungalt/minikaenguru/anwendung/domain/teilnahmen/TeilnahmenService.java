package de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.restclient.AuthproviderRestClient;

/**
 * TeilnahmenService.
 */
@ApplicationScoped
public class TeilnahmenService {

    @ConfigProperty(name = "client.id")
    String clientId;

    @ConfigProperty(name = "client.secret")
    String clientSecret;

    @Inject
    @RestClient
    AuthproviderRestClient authproviderRestClient;
}
