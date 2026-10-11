package de.mathejungalt.minikaenguru.anwendung.domain.schule;

import jakarta.inject.Inject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.github.tomakehurst.wiremock.WireMockServer;

import de.mathejungalt.minikaenguru.anwendung.test.AuthproviderFaultToleranceTimeoutTestProfile;
import de.mathejungalt.minikaenguru.anwendung.test.InjectWireMock;
import de.mathejungalt.minikaenguru.anwendung.test.WireMockAuthprovider;

import static org.junit.jupiter.api.Assertions.assertNull;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

/**
 * SchuleServiceWiremockTest.
 */
@QuarkusTest
@QuarkusTestResource(WireMockAuthprovider.class)
@TestProfile(AuthproviderFaultToleranceTimeoutTestProfile.class)
public class SchuleServiceWiremockTimeoutTest {

    private static final String USER_UUID = "412b67dc-132f-465a-a3c3-468269e866cb";
    private static final String URL = "/api/users/412b67dc-132f-465a-a3c3-468269e866cb/name";

    @ConfigProperty(name = "client.id")
    String clientId;

    @ConfigProperty(name = "client.secret")
    String clientSecret;

    @InjectWireMock
    WireMockServer wireMockServer;

    @Inject
    SchuleService schuleService;

    @BeforeEach
    void setup() {
        wireMockServer.resetAll();
    }

    @Test
    void test_faultToleranceTimeout() {
        wireMockServer
                .stubFor(get(urlEqualTo(URL))
                        .willReturn(aResponse()
                                .withStatus(200)
                                .withFixedDelay(1000)
                                .withHeader("Content-Type", "application/json")
                                .withBody("""
                                                                                    {
                                          "vorname": "Frodo",
                                          "nachname": "Beutlin aus Beutelsend"
                                        }
                                                                                """)));

        // act
        final String kollege = schuleService.loadKollege(USER_UUID);

        // assert
        assertNull(kollege);

        wireMockServer
                .verify(1,
                        getRequestedFor(urlEqualTo(URL))
                                .withHeader("X-CLIENT-ID", equalTo(clientId))
                                .withHeader("X-CLIENT-SECRET", equalTo(clientSecret))
                                .withHeader("X-NONCE",
                                        matching("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")));

    }
}
