package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb;

import java.time.format.DateTimeFormatter;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbEntity;

/**
 * WettbewerbService.
 */
@ApplicationScoped
public class WettbewerbService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    @Inject
    WettbewerbDao wettbewerbDao;

    /**
     * Läd den aktuellen Wettbewerb.
     *
     * @return Wettbewerb
     */
    public Wettbewerb loadAktuellenWettbewerb() {

        final List<WettbewerbEntity> entities = wettbewerbDao.loadWettbewerbeDescending();

        final WettbewerbEntity aktEntity = entities.getFirst();

        return new Wettbewerb()
                .jahr(aktEntity.getJahr())
                .status(aktEntity.getStatus())
                .beginn(DATE_TIME_FORMATTER.format(aktEntity.getBeginn()))
                .ende(DATE_TIME_FORMATTER.format(aktEntity.getEnde()))
                .freischaltungPrivat(DATE_TIME_FORMATTER.format(aktEntity.getFreischaltungPrivat()))
                .freischaltungSchulen(DATE_TIME_FORMATTER.format(aktEntity.getFreischaltungSchulen()));
    }
}
