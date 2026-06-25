package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * VeranstalterResource.
 */
@QuarkusTest
@TestHTTPEndpoint(VeranstalterResource.class)
public class VeranstalterResourceTest {

    @ConfigProperty(name = "session.cookie.name")
    String sessionCookiName;

}
