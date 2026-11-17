package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.LoesungszettelEntity;

/**
 * LoesungszettelDao.
 */
@ApplicationScoped
public class LoesungszettelDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Constructor
     *
     * @return LoesungszettelDao
     */
    public LoesungszettelDao() {
        super();
    }

    /**
     * Gibt den Loesungszettel mit der gegebenen id zurück.
     *
     * @param id Long
     * @return LoesungszettelEntity oder null
     */
    public LoesungszettelEntity findByPrimaryKey(final Long id) {
        return entityManager.find(LoesungszettelEntity.class, id);
    }

    /**
     * Löscht den Lösungszettel.
     *
     * @param entity LoesungszettelEntity
     */
    public void deleteLoesungszettel(final LoesungszettelEntity entity) {
        this.entityManager.remove(entity);
    }

}
