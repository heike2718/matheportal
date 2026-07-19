package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.OrtEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchuleEntity;

/**
 * SchulkatalogDao.
 */
@ApplicationScoped
public class SchulkatalogDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Sucht Orte, deren Name name enthält.
     *
     * @param name String
     * @return List
     */
    public List<OrtEntity> findOrteByName(final String name) {

        final String theName = "%" + name + "%";

        return entityManager
                .createNamedQuery(OrtEntity.FIND_BY_NAME, OrtEntity.class)
                .setParameter("name", theName)
                .getResultList();

    }

    /**
     * Läd die Schulen des Ortes mit der gegebenen ortId.
     *
     * @param ortId String das kuerzel des Orts
     * @return List
     */
    public List<SchuleEntity> loadSchulenInOrt(final String ortId) {
        return entityManager
                .createNamedQuery(SchuleEntity.FIND_BY_ORT_ID, SchuleEntity.class)
                .setParameter("ortId", ortId)
                .getResultList();
    }

}
