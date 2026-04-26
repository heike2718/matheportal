package de.mathejungalt.matheportal.shell.infrastructure.cdi;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

import io.quarkus.runtime.Startup;
import io.quarkus.runtime.StartupEvent;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import lombok.extern.slf4j.Slf4j;

/**
 * StartupListener.
 */
@Startup
@ApplicationScoped
@Slf4j
public final class StartupListener {

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

        log.info(" ===========>  jdbcUrl={}", jdbcUrl);
        log.info(" ===========>  port={}", port);
        log.info(" ===========> quarkus.http.cors.origins={}", corsOrigins);

    }

}
