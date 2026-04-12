package de.mathejungalt.matheportal.shell.domain.oauth;

import jakarta.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * OAuthClientCredentialsProvider.
 */
@ApplicationScoped
public class OAuthClientCredentialsProvider {

    @ConfigProperty(name = "public-client-id")
    String publicClientId;

    @ConfigProperty(name = "public-client-secret")
    String publicClientSecret;

    /**
     * @param nonce String, darf manchmal null sein.
     * @return
     */
    public OAuthClientCredentials getClientCredentials(final String nonce) {
        return OAuthClientCredentials
                .builder()
                .clientId(publicClientId)
                .clientSecret(publicClientSecret)
                .nonce(nonce)
                .build();
    }

}
