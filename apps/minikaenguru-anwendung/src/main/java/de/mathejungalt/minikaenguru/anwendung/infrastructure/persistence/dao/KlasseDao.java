package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KlasseEntity;

/**
 * KlasseDao.
 */
@ApplicationScoped
public class KlasseDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Sucht die Klassen mit dem gegebenen Schulkuerzel.
     *
     * @param schulkuerzel
     * @return
     */
    public List<KlasseEntity> findKlassenBySchulkuerzel(final String schulkuerzel) {

        return entityManager
                .createNamedQuery(KlasseEntity.FIND_KLASSEN_BY_SCHULKURZEL, KlasseEntity.class)
                .setParameter("schulkuerzel", schulkuerzel)
                .getResultList();
    }

}
