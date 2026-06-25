package de.mathejungalt.minikaenguru.anwendung.domain.veranstalter;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Veranstalter;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.VeranstalterDao;

/**
 * VeranstalterService.
 */
@ApplicationScoped
public class VeranstalterService {

    @Inject
    VeranstalterDao veranstalterDao;

    /**
     * Läd den Veranstalter anhand der userUuid.
     *
     * @param userUuid String
     * @return Veranstalter
     */
    public Veranstalter loadVeranstalter(final String userUuid) {
        return null;
    }
}
