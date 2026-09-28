package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.VertragAuftragsdatenverarbeitungEntity;

/**
 * VertragAuftragsdatenverarbeitungDao.
 */
@ApplicationScoped
public class VertragAuftragsdatenverarbeitungDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * VertragAuftragsdatenverarbeitungDao.
     */
    public VertragAuftragsdatenverarbeitungDao() {
        super();
    }

    /**
     * Prüft die Existenz eines DSGVO-Vertrags für die gegebene Schule.
     *
     * @param schulkuerzel String
     * @return boolean
     */
    public boolean schuleHasVertragDSGVO(final String schulkuerzel) {
        return !entityManager
                .createNamedQuery(VertragAuftragsdatenverarbeitungEntity.FIND_ID_BY_SCHULKUERZEL, String.class)
                .setParameter("schulkuerzel", schulkuerzel)
                .getResultList()
                .isEmpty();
    }

}
