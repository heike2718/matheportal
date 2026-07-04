package de.mathejungalt.authsessions.api;

import java.time.Clock;
import java.time.ZoneId;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;

/**
 * Stellt eine Clock mit der gültigen Zeit zur Verfügung.<br>
 * <br>
 * Dadurch lässt sich die injectende clock für Tests mocken.
 */
@ApplicationScoped
public class ClockProducer {

    private static final ZoneId ZONE = ZoneId.of("Europe/Berlin");

    /**
     * Gibt eine Clock zurück.
     *
     * @return Clock
     */
    @Produces
    @ApplicationScoped
    public Clock clock() {
        return Clock.system(ZONE);
    }

}
