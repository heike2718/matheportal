package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.dao.KuerzelDao;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.KuerzelEntity;

/**
 * KuerzelGeneratorService. Generiert Kürzel für den Schulkatalog und Privatteilnahmen.
 */
@ApplicationScoped
public class KuerzelService {

    @Inject
    KuerzelDao kuerzelDao;

    @Inject
    KuerzelGenerator kuerzelGenerator;

    private static final int LENGTH_SCHULKATALOG = 8;

    private static final int MAX_GENERATE_RETRIES = 5;

    /**
     * Generiert ein Kürzel für einen Ort oder eine Schule, den es noch nicht gibt. Diese sind immer 8stellig.
     *
     * @return String
     */
    public String generateSchulkatalogKuerzel() {
        return this.verifyUnique(LENGTH_SCHULKATALOG);
    }

    String verifyUnique(final int length) {

        String kuerzel = this.kuerzelGenerator.generateKuerzel(length);
        KuerzelEntity entity = kuerzelDao.findKuerzelById(kuerzel);

        if (entity == null) {
            return kuerzel;
        }

        for (int attemtCount = 1; attemtCount <= MAX_GENERATE_RETRIES; attemtCount++) {

            kuerzel = this.kuerzelGenerator.generateKuerzel(length);
            entity = kuerzelDao.findKuerzelById(kuerzel);

            if (entity != null) {
                continue;
            } else {
                return kuerzel;
            }

        }

        return null;
    }
}
