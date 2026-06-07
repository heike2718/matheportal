package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;

import de.mathejungalt.matheportal.shell.test.IamIntegrationTestProfile;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestProfile(IamIntegrationTestProfile.class)
@Tag("integration gegen authprovider-docker-container unter localhost:9000")
public class InitAccessTokenDelegateIntegrationTest {

    @Inject
    InitAccessTokenDelegate initAccessTokenDelegate;

    @Test
    void should_authenticate_client() {

        // arrange

        final String nonce = "test-nonce";

        final OAuthClientCredentials credentials = new OAuthClientCredentials("matheportalShellClient", "start123",
                nonce);

        // act
        final OauthClientAccessToken accesToken = initAccessTokenDelegate.authenticateClient(credentials);

        // assert
        assertEquals(nonce, accesToken.getNonce());
    }

}
