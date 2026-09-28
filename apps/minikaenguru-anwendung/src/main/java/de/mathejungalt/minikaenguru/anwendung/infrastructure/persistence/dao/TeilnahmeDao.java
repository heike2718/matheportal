package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.TeilnahmeEntity;

/**
 * TeilnahmeDao.
 */
@ApplicationScoped
public class TeilnahmeDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * TeilnahmeDao
     */
    public TeilnahmeDao() {
        super();
    }

    /**
     * Läd die Referenzen der Teilnahmen mit diesem teilnahmekuerzel.
     *
     * @param teilnahmekuerzel String
     * @return List
     */
    public List<TeilnahmeReferenz> loadTeilnahmereferenzen(final String teilnahmekuerzel) {

        return entityManager
                .createNamedQuery(TeilnahmeEntity.FIND_REFS_BY_TEILNAHMEKUERZEL, TeilnahmeReferenz.class)
                .setParameter("teilnahmekuerzel", teilnahmekuerzel)
                .getResultList();

    }

}
