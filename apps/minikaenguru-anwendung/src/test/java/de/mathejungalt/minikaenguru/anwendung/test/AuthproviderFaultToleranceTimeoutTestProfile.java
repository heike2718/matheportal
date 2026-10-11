package de.mathejungalt.minikaenguru.anwendung.test;

import java.util.Map;

import io.quarkus.test.junit.QuarkusTestProfile;

public class AuthproviderFaultToleranceTimeoutTestProfile implements QuarkusTestProfile {

    @Override
    public Map<String, String> getConfigOverrides() {
        return Map
                .of("de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderRestClient$$CDIWrapper/getUserDetails/Timeout/value",
                        "500");
    }
}
