package de.mathejungalt.minikaenguru.anwendung.infrastructure.cdi;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

import io.quarkus.runtime.StartupEvent;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import lombok.extern.slf4j.Slf4j;

/**
 * StartupListener.
 */
@ApplicationScoped
@Slf4j
public class StartupListener {

    @ConfigProperty(name = "quarkus.datasource.sessions.jdbc.url")
    String sessionsJdbcUrl;

    @ConfigProperty(name = "quarkus.datasource.minikaenguru.jdbc.url")
    String minikaenguruJdbcUrl;

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

        log.info(" ===========>  sessionsJdbcUrl={}", sessionsJdbcUrl);
        log.info(" ===========>  minikaenguruJdbcUrl={}", minikaenguruJdbcUrl);
        log.info(" ===========>  port={}", port);
        log.info(" ===========> quarkus.http.cors.origins={}", corsOrigins);

    }
}
