package de.mathejungalt.minikaenguru.anwendung.infrastructure.test;

import java.util.Map;

import io.quarkus.test.junit.QuarkusTestProfile;

/**
 * MockAugmentSessionTestProfile.
 */
public class MockAugmentSessionTestProfile implements QuarkusTestProfile {

    @Override
    public Map<String, String> getConfigOverrides() {
        return Map.of("mock.augment.session", "true");
    }
}
