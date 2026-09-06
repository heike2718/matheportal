package de.mathejungalt.minikaenguru.admin.infrastructure.persistence.dao;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.LandEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.LandReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.OrtEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.OrtReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleReadonlyEntity;

/**
 * SchulkatalogDao.
 */
@ApplicationScoped
public class SchulkatalogDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Läd alle Länder aus dem Schukatalog.
     *
     * @return List
     */
    public List<LandReadonlyEntity> loadLaender() {
        return entityManager.createNamedQuery(LandReadonlyEntity.LOAD_ALL, LandReadonlyEntity.class).getResultList();
    }

    /**
     * Läd alle Orte im gegebenen Land.
     *
     * @param landId String - das kuerzel
     * @return List
     */
    public List<OrtReadonlyEntity> loadOrteWithLand(final String landId) {
        return entityManager
                .createNamedQuery(OrtReadonlyEntity.LOAD_BY_LAND, OrtReadonlyEntity.class)
                .setParameter("landId", landId)
                .getResultList();
    }

    /**
     * Läd alle Schulen im gegebenen Ort.
     *
     * @param ortId String - das kuerzel
     * @return List
     */
    public List<SchuleReadonlyEntity> loadSchulenWithOrt(final String ortId) {

        return entityManager
                .createNamedQuery(SchuleReadonlyEntity.LOAD_BY_ORT, SchuleReadonlyEntity.class)
                .setParameter("ortId", ortId)
                .getResultList();
    }

    /**
     * Speichert ein neues Land.
     *
     * @param land Land
     */
    public void insertLand(final LandEntity land) {
        this.entityManager.persist(land);
    }

    /**
     * Speichert einen neuen Ort.
     *
     * @param ort Ort
     */
    public void insertOrt(final OrtEntity ort) {
        this.entityManager.persist(ort);
    }

    /**
     * Speichert eine neue Schule.
     *
     * @param schule Schule
     */
    public void insertSchule(final SchuleEntity schule) {
        this.entityManager.persist(schule);
    }

    /**
     * Aktualisiert die gegebene Schule
     *
     * @param schule SchuleEntity
     */
    public void updateSchule(final SchuleEntity schule) {
        this.entityManager.merge(schule);
    }

    /**
     * Gibt das Land mit der gegebenen id zurück.
     *
     * @param kuerzel String
     * @return LandEntity oder null.
     */
    public LandEntity findLandById(final String kuerzel) {
        return this.entityManager.find(LandEntity.class, kuerzel);
    }

    /**
     * Gibt den Ort mit der gegebenen id zurück.
     *
     * @param kuerzel String
     * @return OrtEntity oder null
     */
    public OrtEntity findOrtById(final String kuerzel) {
        return this.entityManager.find(OrtEntity.class, kuerzel);
    }

    /**
     * Gibt die Schule mit der gegebenen id zurück.
     *
     * @param kuerzel String
     * @return SchuleEntity oder null
     */
    public SchuleEntity findSchuleById(final String kuerzel) {
        return this.entityManager.find(SchuleEntity.class, kuerzel);
    }

    /**
     * Suchzt die SchuleReadonlyEntity anhand ihrer ID.
     *
     * @param kuerzel String
     * @return SchuleReadonlyEntity oder null
     */
    public SchuleReadonlyEntity findDatenSchuleById(final String kuerzel) {
        return this.entityManager.find(SchuleReadonlyEntity.class, kuerzel);
    }

}
