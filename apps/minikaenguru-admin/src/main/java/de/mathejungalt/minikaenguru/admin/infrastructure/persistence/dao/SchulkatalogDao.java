package de.mathejungalt.minikaenguru.admin.infrastructure.persistence.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.LandReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.OrtReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleReadonlyEntity;

/**
 * SchulkatalogDao.
 */
@ApplicationScoped
public class SchulkatalogDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Läd alle Länder aus dem Schukatalog.
     *
     * @return List
     */
    public List<LandReadonlyEntity> loadLaender() {
        return entityManager.createNamedQuery(LandReadonlyEntity.LOAD_ALL, LandReadonlyEntity.class).getResultList();
    }

    /**
     * Läd alle Orte im gegebenen Land.
     *
     * @param landId String - das kuerzel
     * @return List
     */
    public List<OrtReadonlyEntity> loadOrteWithLand(final String landId) {
        return entityManager
                .createNamedQuery(OrtReadonlyEntity.LOAD_BY_LAND, OrtReadonlyEntity.class)
                .setParameter("landId", landId)
                .getResultList();
    }

    /**
     * Läd alle Schulen im gegebenen Ort.
     *
     * @param ortId String - das kuerzel
     * @return List
     */
    public List<SchuleReadonlyEntity> loadSchulenWithOrt(final String ortId) {

        return entityManager
                .createNamedQuery(SchuleReadonlyEntity.LOAD_BY_ORT, SchuleReadonlyEntity.class)
                .setParameter("ortId", ortId)
                .getResultList();
    }

}
