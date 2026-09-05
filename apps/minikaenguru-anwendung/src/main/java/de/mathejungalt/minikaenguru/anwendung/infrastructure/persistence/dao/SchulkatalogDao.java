package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.OrtEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchuleEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * SchulkatalogDao.
 */
@ApplicationScoped
@Slf4j
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

        final String theName = name + "%";

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

    /**
     * Läd die Schule mit dem gegebenen kuerzel
     *
     * @param kuerzel String
     * @return Optional
     */
    public Optional<SchuleEntity> findSchuleByKuerzel(final String kuerzel) {

        final List<SchuleEntity> resultList = entityManager
                .createNamedQuery(SchuleEntity.FIND_BY_KUERZEL, SchuleEntity.class)
                .setParameter("kuerzel", kuerzel)
                .getResultList();

        if (resultList.isEmpty()) {
            return Optional.empty();
        }

        if (resultList.size() > 1) { // NOPMD - 1 is the natural threshold for multiple results
            log.error("mehr als eine Schule mit kuerzel {} im Schulkatalog - unmöglich wegen UK.", kuerzel);
        }

        return Optional.of(resultList.getFirst());

    }

}
