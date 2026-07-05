package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KuerzelEntity;

/**
 * KuerzelDao.
 */
@ApplicationScoped
public class KuerzelDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Sucht den Eintrag in vw_kuerzel, der hier passt.
     *
     * @param kuerzel String
     * @return KuerzelEntity oder null;
     */
    public KuerzelEntity findKuerzelById(final String kuerzel) {
        return entityManager.find(KuerzelEntity.class, kuerzel);
    }

}
