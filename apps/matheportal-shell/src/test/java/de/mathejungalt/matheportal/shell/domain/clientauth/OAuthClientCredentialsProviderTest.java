package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
public class OAuthClientCredentialsProviderTest {

    @Inject
    OAuthClientCredentialsProvider oAuthClientCredentialsProvider;

    @ConfigProperty(name = "public-client-id")
    String publicClientId;

    @ConfigProperty(name = "public-client-secret")
    String publicClientSecret;

    @Test
    void shouldReadTheConfig() {

        // arrange
        final String nonce = "test-nonce";

        // act
        final OAuthClientCredentials credentials = oAuthClientCredentialsProvider.getClientCredentials(nonce);

        // assert
        assertAll(() -> assertEquals("test-nonce", credentials.getNonce()),
                () -> assertEquals("matheportal-shell-client", credentials.getClientId()),
                () -> assertEquals("start123", credentials.getClientSecret()));

    }

}
