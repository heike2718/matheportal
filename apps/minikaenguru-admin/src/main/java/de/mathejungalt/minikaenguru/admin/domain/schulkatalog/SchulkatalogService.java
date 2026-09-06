package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import de.mathejungalt.minikaenguru.admin.domain.exception.MinikaenguruAdminNotFoundException;
import de.mathejungalt.minikaenguru.admin.domain.generated.Land;
import de.mathejungalt.minikaenguru.admin.domain.generated.LandMitOrtUndSchuleAnlegenRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.Ort;
import de.mathejungalt.minikaenguru.admin.domain.generated.OrtMitSchuleAnlegenRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.Schule;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleAnlegenOderAendernRequest;
import de.mathejungalt.minikaenguru.admin.domain.generated.Schulkuerzel;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.dao.SchulkatalogDao;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.LandEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.LandReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.OrtEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.OrtReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleReadonlyEntity;

import lombok.extern.slf4j.Slf4j;

@ApplicationScoped
@Slf4j
public class SchulkatalogService {

    private static final ZoneId ZONE = ZoneId.of("Europe/Berlin");

    private final SchulkatalogMapper schulkatalogMapper = new SchulkatalogMapper();

    @Inject
    KuerzelService kuerzelService;

    @Inject
    SchulkatalogDao schulkatalogDao;

    /**
     * Läd die Länder zur Suche im Schulkatalog.
     *
     * @return List
     */
    public List<Land> loadLaender() {

        final List<LandReadonlyEntity> trefferliste = schulkatalogDao.loadLaender();
        return trefferliste.stream().map(schulkatalogMapper::mapFromEntity).toList();
    }

    /**
     * Läd die Orte eines Landes zur Suche im Schulkatalog.
     *
     * @return List
     */
    public List<Ort> loadOrteInLand(final String landId) {

        final List<OrtReadonlyEntity> trefferliste = schulkatalogDao.loadOrteWithLand(landId);

        return trefferliste.stream().map(schulkatalogMapper::mapFromEntity).toList();

    }

    /**
     * Läd die Schulen eines Ortes zur Suche im Schulkatalog.
     *
     * @return List
     */
    public List<Schule> loadSchulenInOrt(final String ortId) {
        final List<SchuleReadonlyEntity> trefferliste = schulkatalogDao.loadSchulenWithOrt(ortId);
        return trefferliste.stream().map(schulkatalogMapper::mapFromEntity).toList();
    }

    /**
     * Legt eine Schule im Ort mit dem gegebenen kuerzel an.
     *
     * @param kuerzelOrt     String
     * @param requestPayload SchuleAnlegenOderAendernRequest
     * @return Schulkuerzel
     */
    @Transactional
    public Schulkuerzel schuleInOrtAnlegen(final String kuerzelOrt,
            final SchuleAnlegenOderAendernRequest requestPayload) {

        final OrtEntity ort = this.schulkatalogDao.findOrtById(kuerzelOrt);
        if (ort == null) {
            throw new MinikaenguruAdminNotFoundException("Ort mit kuerzel " + kuerzelOrt + " existiert nicht");
        }

        // brauchen hier keine Vorkehrungen wegen UK-Violation, da es keine parallele
        // Bearbeitung gibt im Moment.
        final String kuerzelSchule = this.kuerzelService.generateSchulkatalogKuerzel();

        final LocalDateTime jetzt = LocalDateTime.now(ZONE);

        final SchuleEntity schule = SchuleEntity
                .builder()
                .createdAt(jetzt)
                .updatedAt(jetzt)
                .kuerzelOrt(kuerzelOrt)
                .kuerzel(kuerzelSchule)
                .name(requestPayload.getName())
                .build();

        schulkatalogDao.insertSchule(schule);

        // TODO: Mail versenden
        return new Schulkuerzel().kuerzel(schule.getKuerzel());
    }

    /**
     * Legt Ort und Schule im gegebenen Land an.
     *
     * @param requestPayload OrtMitSchuleAnlegenRequest
     * @return Schulkuerzel
     */
    @Transactional
    public Schulkuerzel schuleInLandAnlegen(final String kuerzelLand, final OrtMitSchuleAnlegenRequest requestPayload) {

        final LandEntity land = this.schulkatalogDao.findLandById(kuerzelLand);
        if (land == null) {
            throw new MinikaenguruAdminNotFoundException("Land mit kuerzel " + kuerzelLand + " existiert nicht");
        }

        // brauchen hier keine Vorkehrungen wegen UK-Violation, da es keine parallele
        // Bearbeitung gibt im Moment.
        final String kuerzelOrt = this.kuerzelService.generateSchulkatalogKuerzel();
        final String kuerzelSchule = this.kuerzelService.generateSchulkatalogKuerzel();

        final LocalDateTime jetzt = LocalDateTime.now(ZONE);

        final OrtEntity ort = OrtEntity
                .builder()
                .createdAt(jetzt)
                .updatedAt(jetzt)
                .kuerzelLand(kuerzelLand)
                .kuerzel(kuerzelOrt)
                .name(requestPayload.getNameOrt())
                .build();

        final SchuleEntity schule = SchuleEntity
                .builder()
                .createdAt(jetzt)
                .updatedAt(jetzt)
                .kuerzelOrt(kuerzelOrt)
                .kuerzel(kuerzelSchule)
                .name(requestPayload.getNameSchule())
                .build();

        this.schulkatalogDao.insertOrt(ort);
        this.schulkatalogDao.insertSchule(schule);

        // TODO: Mail versenden
        return new Schulkuerzel().kuerzel(schule.getKuerzel());

    }

    /**
     * Legt Land, Ort und Schule an.
     *
     * @param requestPayloyd LandMitOrtUndSchuleAnlegenRequest
     * @return Schulkuerzel
     */
    @Transactional
    public Schulkuerzel schuleAnlegen(final LandMitOrtUndSchuleAnlegenRequest requestPayload) {

        // brauchen hier keine Vorkehrungen wegen UK-Violation, da es keine parallele
        // Bearbeitung gibt im Moment.
        final String kuerzelOrt = this.kuerzelService.generateSchulkatalogKuerzel();
        final String kuerzelSchule = this.kuerzelService.generateSchulkatalogKuerzel();

        final LocalDateTime jetzt = LocalDateTime.now(ZONE);

        final LandEntity land = LandEntity
                .builder()
                .createdAt(jetzt)
                .updatedAt(jetzt)
                .kuerzel(requestPayload.getKuerzelLand())
                .name(requestPayload.getNameLand())
                .build();

        final OrtEntity ort = OrtEntity
                .builder()
                .createdAt(jetzt)
                .updatedAt(jetzt)
                .kuerzelLand(requestPayload.getKuerzelLand())
                .kuerzel(kuerzelOrt)
                .name(requestPayload.getNameOrt())
                .build();

        final SchuleEntity schule = SchuleEntity
                .builder()
                .createdAt(jetzt)
                .updatedAt(jetzt)
                .kuerzelOrt(kuerzelOrt)
                .kuerzel(kuerzelSchule)
                .name(requestPayload.getNameSchule())
                .build();

        this.schulkatalogDao.insertLand(land);
        this.schulkatalogDao.insertOrt(ort);
        this.schulkatalogDao.insertSchule(schule);

        // TODO: Mail versenden

        return new Schulkuerzel().kuerzel(schule.getKuerzel());
    }

    /**
     * Bennennt die Schule mit dem gegebenen kuerzel um und sendet eine Infomail an die mailadresse.
     *
     * @param kuerzel:       String
     * @param requestPayload SchuleAnlegenOderAendernRequest
     * @return Schulkuerzel
     */
    @Transactional
    public Schulkuerzel schuleUmbenennen(final String kuerzel, final SchuleAnlegenOderAendernRequest requestPayload) {

        final SchuleEntity schuleEntity = schulkatalogDao.findSchuleById(kuerzel);

        if (schuleEntity == null) {
            throw new MinikaenguruAdminNotFoundException("Schule mit kuerzel " + kuerzel + " existiert nicht");
        }

        schuleEntity.setName(requestPayload.getName());
        schuleEntity.setUpdatedAt(LocalDateTime.now(ZONE));

        schulkatalogDao.updateSchule(schuleEntity);

        // TODO: mail versenden

        return new Schulkuerzel().kuerzel(kuerzel);
    }
}
