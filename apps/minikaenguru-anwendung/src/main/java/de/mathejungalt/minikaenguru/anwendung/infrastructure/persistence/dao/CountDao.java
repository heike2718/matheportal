package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KindEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KlasseEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.LoesungszettelEntity;

/**
 * CountDao. Zum Zählen verschiedener Entitäten.
 */
@ApplicationScoped
public class CountDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Ermittelt die Anzahl von Lösungszetteln zu einer speziellen Teilnahme.
     *
     * @param teilnahmekuerzel String
     * @param jahr             Integer
     * @return int
     */
    public int getAnzahlLoesungszettelByTeilnahmekuerzelAndJahr(String teilnahmekuerzel, final Integer jahr) {

        return entityManager
                .createNamedQuery(LoesungszettelEntity.COUNT_BY_TEILNAHMEKUERZEL_AND_JAHR, Long.class)
                .setParameter("teilnahmekuerzel", teilnahmekuerzel)
                .setParameter("jahr", jahr)
                .getSingleResult()
                .intValue();
    }

    /**
     * Ermittelt die Anzahl von Kindern einer speziellen Teilnahme.
     *
     * @param teilnahmekuerzel String
     * @return int
     */
    public int getAnzahlKinderByTeilnahmekuerzel(String teilnahmekuerzel) {

        return entityManager
                .createNamedQuery(KindEntity.COUNT_BY_TEILNAHMEKUERZEL, Long.class)
                .setParameter("teilnahmekuerzel", teilnahmekuerzel)
                .getSingleResult()
                .intValue();

    }

    /**
     * Ermittelt die Anzahl Klassen einer speziellen Schule.
     *
     * @param kuerzelSchule String
     * @return int
     */
    public int getAnzahlKlassenByKuerzelSchule(String kuerzelSchule) {

        return entityManager
                .createNamedQuery(KlasseEntity.COUNT_BY_KUERZEL_SCHULE, Long.class)
                .setParameter("kuerzelSchule", kuerzelSchule)
                .getSingleResult()
                .intValue();
    }

}
