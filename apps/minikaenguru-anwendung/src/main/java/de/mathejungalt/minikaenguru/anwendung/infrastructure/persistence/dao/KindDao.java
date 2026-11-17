package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KindEntity;

/**
 * KindDao.
 */
@ApplicationScoped
public class KindDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Constructor.
     *
     * @return KindDao
     */
    public KindDao() {
        super();
    }

    /**
     * Sucht die Kinder mit der gegebenen klasseUuid.
     *
     * @param klasseUuid String
     * @return List
     */
    public List<KindEntity> findKinderByKlasseId(final String klasseId) {

        return entityManager
                .createNamedQuery(KindEntity.FIND_KINDER_BY_KLASSE_ID, KindEntity.class)
                .setParameter("klasseId", klasseId)
                .getResultList();

    }

    /**
     * Löscht die Entity.
     *
     * @param entity KindEntity
     */
    public void deleteKind(final KindEntity entity) {
        this.entityManager.remove(entity);
    }

}
