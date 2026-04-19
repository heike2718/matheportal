package de.mathejungalt.matheportal.shell.infrastructure.cdi;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import io.quarkus.runtime.Startup;
import io.quarkus.runtime.StartupEvent;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * StartupListener.
 */
@Startup
@ApplicationScoped
public class StartupListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(StartupListener.class);

    @ConfigProperty(name = "quarkus.datasource.sessions.jdbc.url")
    String jdbcUrl;

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

        LOGGER.info(" ===========>  jdbcUrl={}", jdbcUrl);
        LOGGER.info(" ===========>  port={}", port);
        LOGGER.info(" ===========> quarkus.http.cors.origins={}", corsOrigins);

    }

}
