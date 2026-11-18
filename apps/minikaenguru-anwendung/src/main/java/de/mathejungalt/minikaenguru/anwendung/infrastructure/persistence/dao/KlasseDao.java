package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

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
     * Constructor.
     *
     * @return KlasseDao
     */
    public KlasseDao() {
        super();
    }

    /**
     * Sucht die Klasse anhand des primary keys.
     *
     * @param klasseUuid String
     * @return KlasseEntity oder null
     */
    public KlasseEntity findKlasseByPrimaryKey(final String klasseUuid) {
        return entityManager.find(KlasseEntity.class, klasseUuid);
    }

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

    /**
     * Speichert eine neue Klasse.
     *
     * @param entity KlasseEntity
     */
    @Transactional
    public void insertKlasse(final KlasseEntity entity) {
        this.entityManager.persist(entity);
    }

    /**
     * Ändert eine vorhandene Klasse.
     *
     * @param entity KlasseEntity
     */
    @Transactional
    public void updateKlasse(final KlasseEntity entity) {
        this.entityManager.merge(entity);
    }

    /**
     * Löscht die Entity.
     *
     * @param entity KlasseEntity
     */
    public void deleteKlasse(final KlasseEntity entity) {
        this.entityManager.remove(entity);
    }

}
