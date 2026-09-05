package de.mathejungalt.minikaenguru.admin.test;

import java.util.ArrayList;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.dao.SchulkatalogDao;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.LandEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.OrtEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.OrtReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleReadonlyEntity;

@ApplicationScoped
public class CleanupTestDataDao {

    @Inject
    SchulkatalogDao schulkatalogDao;

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    @Transactional
    public void deleteLand(final String kuerzelLand) {

        final LandEntity landEntity = entityManager.find(LandEntity.class, kuerzelLand);

        if (landEntity == null) {
            return;
        }

        final List<OrtReadonlyEntity> orteInLand = schulkatalogDao.loadOrteWithLand(kuerzelLand);

        final List<String> kuerzelOrte = orteInLand.stream().map(o -> o.getKuerzel()).toList();

        final List<String> kuerzelSchulen = new ArrayList<>();

        for (final OrtReadonlyEntity ortReadonly : orteInLand) {
            final List<SchuleReadonlyEntity> schulenWithOrt = schulkatalogDao
                    .loadSchulenWithOrt(ortReadonly.getKuerzel());
            schulenWithOrt.forEach(s -> kuerzelSchulen.add(s.getKuerzel()));
        }

        this.deleteSchulen(kuerzelSchulen);
        this.deleteOrte(kuerzelOrte);
        this.doDeleteLand(kuerzelLand);

    }

    void deleteSchulen(final List<String> kuerzelSchulen) {

        for (final String kuerzel : kuerzelSchulen) {
            final SchuleEntity schuleEntity = entityManager.find(SchuleEntity.class, kuerzel);
            if (schuleEntity != null) {
                entityManager.remove(schuleEntity);
            }
        }

        System.out.println(">>>>> schulen mit kuerzeln " + kuerzelSchulen + " gelöscht");

    }

    void deleteOrte(final List<String> kuerzelOrte) {

        for (final String kuerzel : kuerzelOrte) {
            final OrtEntity ortEntity = entityManager.find(OrtEntity.class, kuerzel);
            if (ortEntity != null) {
                entityManager.remove(ortEntity);
            }
        }

        System.out.println(">>>>> orte mit kuerzeln " + kuerzelOrte + " gelöscht");

    }

    void doDeleteLand(final String kuerzelLand) {

        final LandEntity landEntity = entityManager.find(LandEntity.class, kuerzelLand);
        if (landEntity != null) {
            entityManager.remove(landEntity);
            System.out.println(">>>>> land mit kuerzel " + kuerzelLand + " gelöscht");
        }

    }
}
