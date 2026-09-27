package de.mathejungalt.minikaenguru.anwendung.domain.schulkatalog;

import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.ResourceNotFoundException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Land;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Ort;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.AuthorizationKey;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.KuerzelZugriff;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkatalogDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.OrtEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchuleEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * SchulkatalogService.
 */
@ApplicationScoped
@Slf4j
public class SchulkatalogService {

    @Inject
    SchulkatalogDao schulkatalogDao;

    /**
     * Sucht Orte, deren Name name enthält.
     *
     * @param name String
     * @return List
     */
    public List<Ort> findOrte(final String name) {

        final List<OrtEntity> trefferliste = schulkatalogDao.findOrteByName(name);
        return trefferliste.stream().map(this::mapFromDb).toList();
    }

    Ort mapFromDb(final OrtEntity entity) {
        final Land land = new Land().kuerzel(entity.getLandId()).name(entity.getLand().trim());
        return new Ort()
                .kuerzel(entity.getKuerzel())
                .name(entity.getName().trim())
                .land(land)
                .anzahlSchulen(entity.getAnzahlSchulen());
    }

    /**
     * Läd die Schulen in einem Ort mit der gegebenen id.
     *
     * @param ortId String das kuerzel des Ortes
     * @return List
     */
    public List<Schule> loadSchulen(final String ortId) {
        final List<SchuleEntity> trefferliste = schulkatalogDao.loadSchulenInOrt(ortId);
        return trefferliste.stream().map(this::mapFromDb).toList();
    }

    Schule mapFromDb(final SchuleEntity entity) {
        final Land land = new Land().kuerzel(entity.getLandId()).name(entity.getLand().trim());

        final Ort ort = new Ort().kuerzel(entity.getOrtId()).name(entity.getOrt().trim()).land(land);

        return new Schule().kuerzel(entity.getKuerzel()).name(entity.getName().trim()).ort(ort);
    }

    /**
     * Holt die Schule mit dem gegebenen kuerzel.
     *
     * @param kuerzel
     * @return Schule oder null
     */
    @KuerzelZugriff("Schule laden")
    public Schule getSchule(@AuthorizationKey final String kuerzel) {

        final Optional<SchuleEntity> optional = schulkatalogDao.findSchuleByKuerzel(kuerzel);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Schule mit kuerzel=" + kuerzel);
        }

        final SchuleEntity entity = optional.get();

        return mapFromDb(entity);
    }
}
