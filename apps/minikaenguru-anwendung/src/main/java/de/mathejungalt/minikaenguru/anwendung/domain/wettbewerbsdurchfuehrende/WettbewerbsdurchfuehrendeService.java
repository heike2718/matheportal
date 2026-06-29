package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;

/**
 * WettbewerbsdurchfuehrendeService.
 */
@ApplicationScoped
public class WettbewerbsdurchfuehrendeService {

    @Inject
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrender;

    /**
     * Läd den Wettbewerbsdurchfuehrenden anhand der userUuid.
     *
     * @param userUuid String
     * @return Wettbewerbsdurchfuehrender
     */
    public Wettbewerbsdurchfuehrender loadDurchfuehrenden(final String userUuid) {
        return null;
    }
}
