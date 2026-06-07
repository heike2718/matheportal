package de.mathejungalt.matheportal.shell.test;

import java.util.Map;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;

public class WireMockAuthprovider implements QuarkusTestResourceLifecycleManager {

    private WireMockServer wireMockServer;

    @Override
    public Map<String, String> start() {
        wireMockServer = new WireMockServer(WireMockConfiguration.wireMockConfig().dynamicPort());
        wireMockServer.start();
        return Map.of("quarkus.rest-client.authprovider.url", wireMockServer.baseUrl());
    }

    @Override
    public void stop() {
        if (wireMockServer != null) {
            wireMockServer.stop();
        }
    }

    @Override
    public void inject(final TestInjector testInjector) {
        testInjector
                .injectIntoFields(wireMockServer, field -> field.getType().equals(WireMockServer.class)
                        && field.getDeclaredAnnotation(InjectWireMock.class) != null);
    }
}
