package de.mathejungalt.matheportal.shell.infrastructure.filter;

import java.io.IOException;

import jakarta.ws.rs.client.ClientRequestContext;
import jakarta.ws.rs.client.ClientRequestFilter;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class RestClientLoggingFilter implements ClientRequestFilter {

    @ConfigProperty(name = "quarkus.rest-client.authprovider.url")
    String authproviderUrl;

    @Override
    public void filter(final ClientRequestContext requestContext) throws IOException {
        final String uri = requestContext.getUri().getRawPath();

        log.info("authprovider aufgerufen mit authproviderUrl={} und uri={}", authproviderUrl, uri);

    }

}
