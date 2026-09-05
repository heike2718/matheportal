package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import de.mathejungalt.minikaenguru.admin.domain.generated.LandReadonly;
import de.mathejungalt.minikaenguru.admin.domain.generated.OrtReadonly;
import de.mathejungalt.minikaenguru.admin.domain.generated.SchuleReadonly;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.LandReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.OrtReadonlyEntity;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleReadonlyEntity;

public class SchulkatalogMapper {

    /**
     * Mapped die Entity auf das Dto.<br>
     * <br>
     * Achtung: die Anzahl Orte des Landes und die Anzahl Schulen des Ortes sind nicht ermittelbar.
     *
     * @param entity SchuleReadonlyEntity
     * @return SchuleReadonly
     */
    SchuleReadonly mapFromEntity(final SchuleReadonlyEntity entity) {

        final LandReadonly land = new LandReadonly().anzahlOrte(0).kuerzel(entity.getLandId()).name(entity.getLand());

        final OrtReadonly ort = new OrtReadonly()
                .anzahlSchulen(0)
                .kuerzel(entity.getOrtId())
                .land(land)
                .name(entity.getOrt());

        return new SchuleReadonly().kuerzel(entity.getKuerzel()).name(entity.getName()).ort(ort);
    }

    /**
     * Mapped die Entity auf das Dto.<br>
     * <br>
     * Achtung: die Anzahl Orte des Landes ist nicht ermittelbar.
     *
     * @param entity OrtReadonlyEntity
     * @return List
     */
    OrtReadonly mapFromEntity(final OrtReadonlyEntity entity) {
        final LandReadonly land = new LandReadonly().anzahlOrte(0).kuerzel(entity.getLandId()).name(entity.getLand());

        return new OrtReadonly()
                .anzahlSchulen(entity.getAnzahlSchulen())
                .kuerzel(entity.getKuerzel())
                .land(land)
                .name(entity.getName());
    }

    /**
     * Mapped die Entity auf das Dto.
     *
     * @param entity LandReadonlyEntity
     * @return LandReadonly
     */
    LandReadonly mapFromEntity(final LandReadonlyEntity entity) {

        return new LandReadonly()
                .anzahlOrte(entity.getAnzahlOrte())
                .kuerzel(entity.getKuerzel())
                .name(entity.getName());

    }

}
