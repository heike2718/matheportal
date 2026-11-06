package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

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
     * TeilnahmeDao.
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

    /**
     * Speichert eine neue Teilnahme.
     *
     * @param entity TeilnahmeEntity
     */
    @Transactional
    public void insertTeilnahme(final TeilnahmeEntity entity) {
        this.entityManager.persist(entity);
    }

    /**
     * Läd die Entity anhand ihres eindeutigen fachlichen Schlüssels.
     *
     * @param teilnahmekuerzel String
     * @param jahr             Interger
     * @return TeilnahmeEntity oder null
     */
    public TeilnahmeEntity findTeilnahmeByUniqueKey(final String teilnahmekuerzel, final Integer jahr) {

        final List<TeilnahmeEntity> resultList = entityManager
                .createNamedQuery(TeilnahmeEntity.FIND_BY_UNIQUE_KEY, TeilnahmeEntity.class)
                .setParameter("teilnahmekuerzel", teilnahmekuerzel)
                .setParameter("jahr", jahr)
                .getResultList();

        return resultList.isEmpty() ? null : resultList.getFirst();
    }

}
