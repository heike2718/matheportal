package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import de.mathejungalt.minikaenguru.admin.domain.generated.Land;
import de.mathejungalt.minikaenguru.admin.domain.generated.Ort;
import de.mathejungalt.minikaenguru.admin.domain.generated.Schule;
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
    Schule mapFromEntity(final SchuleReadonlyEntity entity) {

        final Land land = new Land().anzahlOrte(0).kuerzel(entity.getKuerzelLand()).name(entity.getNameLand());

        final Ort ort = new Ort().anzahlSchulen(0).kuerzel(entity.getKuerzelOrt()).land(land).name(entity.getNameOrt());

        return new Schule().kuerzel(entity.getKuerzel()).name(entity.getName()).ort(ort);
    }

    /**
     * Mapped die Entity auf das Dto.<br>
     * <br>
     * Achtung: die Anzahl Orte des Landes ist nicht ermittelbar.
     *
     * @param entity OrtReadonlyEntity
     * @return List
     */
    Ort mapFromEntity(final OrtReadonlyEntity entity) {
        final Land land = new Land().anzahlOrte(0).kuerzel(entity.getKuerzelLand()).name(entity.getNameLand());

        return new Ort()
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
    Land mapFromEntity(final LandReadonlyEntity entity) {

        return new Land().anzahlOrte(entity.getAnzahlOrte()).kuerzel(entity.getKuerzel()).name(entity.getName());

    }

}
