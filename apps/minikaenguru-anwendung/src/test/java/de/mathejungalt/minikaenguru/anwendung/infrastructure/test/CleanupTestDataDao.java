package de.mathejungalt.minikaenguru.anwendung.infrastructure.test;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

/**
 * CleanupTestDataDao.
 */
@ApplicationScoped
public class CleanupTestDataDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    @Transactional
    public void deleteWettbewerbsdurchfuehrendeByUserUuid(final String userUuid) {

        final WettbewerbsdurchfuehrenderEntity entity = entityManager
                .createNamedQuery(WettbewerbsdurchfuehrenderEntity.FIND_BY_USER_UUID,
                        WettbewerbsdurchfuehrenderEntity.class)
                .setParameter("userUuid", userUuid)
                .getSingleResultOrNull();

        if (entity != null) {
            this.entityManager.remove(entity);
        }
    }

    @Transactional
    public void deleteSchulkollegiumMitglied(final String userUuid) {
        entityManager
                .createNativeQuery("delete from schulkollegien where user_uuid = :userUuid")
                .setParameter("userUuid", userUuid)
                .executeUpdate();
    }
}
