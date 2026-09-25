package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbEntity;

/**
 * WettbewerbDao.
 */
@ApplicationScoped
public class WettbewerbDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Läd die Wettbewerbe absteigend nach jahr, so dass der aktuelle der erste ist.
     *
     * @return List
     */
    public List<WettbewerbEntity> loadWettbewerbeDescending() {

        return entityManager.createNamedQuery(WettbewerbEntity.LOAD_ALL, WettbewerbEntity.class).getResultList();

    }

}
