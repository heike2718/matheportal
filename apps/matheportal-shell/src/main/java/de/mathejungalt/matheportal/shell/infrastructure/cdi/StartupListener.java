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
    String sessionsJdbcUrl;

    @ConfigProperty(name = "quarkus.http.cors.origins")
    String corsOrigins;

    @ConfigProperty(name = "quarkus.http.port")
    String port;

    @ConfigProperty(name = "client.redirect.url")
    String clientRedirectUrl;

    /**
     * On startup.
     *
     * @param startupEvent StartupEvent - the startupEvent
     */
    void onStartup(@Observes final StartupEvent startupEvent) {

        log.info(" ===========>  sessionsJdbcUrl={}", sessionsJdbcUrl);
        log.info(" ===========>  port={}", port);
        log.info(" ===========> quarkus.http.cors.origins={}", corsOrigins);
        log.info(" ===========> client.redirect.url={}", clientRedirectUrl);
    }

}
