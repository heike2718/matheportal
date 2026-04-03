package de.mathejungalt.matheportal.shell.infrastructure.cdi;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

/**
 * StartupListener.
 */
@ApplicationScoped
public class StartupListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(StartupListener.class);

    @ConfigProperty(name = "quarkus.http.cors.origins")
    String corsOrigins;

    @ConfigProperty(name = "quarkus.http.port")
    String port;

    /**
     * On startup.
     *
     * @param startupEvent StartupEvent - the startupEvent
     */
    void onStartup(@Observes final StartupEvent startupEvent) {

        LOGGER.info(" ===========>  port={}", port);
        LOGGER.info(" ===========> quarkus.http.cors.origins={}", corsOrigins);

    }

}
