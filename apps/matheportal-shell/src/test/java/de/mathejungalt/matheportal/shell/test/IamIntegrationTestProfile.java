package de.mathejungalt.matheportal.shell.test;

import java.util.Map;

import io.quarkus.test.junit.QuarkusTestProfile;

public class IamIntegrationTestProfile implements QuarkusTestProfile {

    @Override
    public Map<String, String> getConfigOverrides() {
        return Map.of("quarkus.rest-client.authprovider.url", "http://localhost:9000");
    }

    @Override
    public boolean disableGlobalTestResources() {
        return true;
    }
}
