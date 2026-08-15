package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.minikaenguru.admin.domain.generated.LandReadonly;
import de.mathejungalt.minikaenguru.admin.domain.generated.OrtReadonly;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleReadonly;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.dao.SchulkatalogDao;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.LandReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.OrtReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleReadonlyEntity;

import lombok.extern.slf4j.Slf4j;

@ApplicationScoped
@Slf4j
public class SchulkatalogService {

    private final SchulkatalogMapper schulkatalogMapper = new SchulkatalogMapper();

    @Inject
    SchulkatalogDao schulkatalogDao;

    /**
     * Läd die Länder zur Suche im Schulkatalog.
     *
     * @return List
     */
    public List<LandReadonly> loadLaender() {

        final List<LandReadonlyEntity> trefferliste = schulkatalogDao.loadLaender();
        return trefferliste.stream().map(land -> schulkatalogMapper.mapFromEntity(land)).toList();
    }

    /**
     * Läd die Orte eines Landes zur Suche im Schulkatalog.
     *
     * @return List
     */
    public List<OrtReadonly> loadOrteInLand(final String landId) {

        final List<OrtReadonlyEntity> trefferliste = schulkatalogDao.loadOrteWithLand(landId);
        return trefferliste.stream().map(ort -> schulkatalogMapper.mapFromEntity(ort)).toList();

    }

    /**
     * Läd die Schulen eines Ortes zur Suche im Schulkatalog.
     *
     * @return List
     */
    public List<SchuleReadonly> loadSchulenInOrt(final String ortId) {
        final List<SchuleReadonlyEntity> trefferliste = schulkatalogDao.loadSchulenWithOrt(ortId);
        return trefferliste.stream().map(schule -> schulkatalogMapper.mapFromEntity(schule)).toList();
    }
}
