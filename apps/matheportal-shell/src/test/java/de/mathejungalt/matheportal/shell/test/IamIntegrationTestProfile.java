package de.mathejungalt.matheportal.shell.test;

import io.quarkus.test.junit.QuarkusTestProfile;

import java.util.Map;

public class IamIntegrationTestProfile implements QuarkusTestProfile {

    @Override
    public Map<String, String> getConfigOverrides() {
        return Map.of("quarkus.rest-client.authprovider.url", "http://localhost:9000");
    }
}
