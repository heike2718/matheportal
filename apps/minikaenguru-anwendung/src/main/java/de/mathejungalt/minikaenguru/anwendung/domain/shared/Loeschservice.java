package de.mathejungalt.minikaenguru.anwendung.domain.shared;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventService;
import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventType;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.KindDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.KlasseDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.LoesungszettelDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KindEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KlasseEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.LoesungszettelEntity;

/**
 * Loeschservice. Übernimmt das Löschen von Entitäten
 */
@ApplicationScoped
public class Loeschservice {

    @Inject
    AuditEventService auditEventService;

    @Inject
    LoesungszettelDao loesungszettelDao;

    @Inject
    KindDao kindDao;

    @Inject
    KlasseDao klasseDao;

    @Inject
    SecurityIdentity securityIdentity;

    /**
     * Löscht alle Klassen einer Schule nebst Kindern und Lösungszetteln und protokolliert das Event.
     *
     * @param schulkuerzel String
     */
    @Transactional
    public void alleKlassenEinerSchuleLoeschen(final String schulkuerzel) {

        List<KlasseEntity> klassen = klasseDao.findKlassenBySchulkuerzel(schulkuerzel);

        int anzahlKlassen = 0;
        int anzahlKinder = 0;
        int anzahlLoesungszettel = 0;

        for (KlasseEntity klasseEntity : klassen) {

            List<KindEntity> kinder = kindDao.findKinderByKlasseId(klasseEntity.getUuid());

            for (KindEntity kindEntity : kinder) {

                if (kindEntity.getLoesungszettelId() != null) {
                    LoesungszettelEntity loesungszettel = loesungszettelDao
                            .findByPrimaryKey(kindEntity.getLoesungszettelId());
                    loesungszettelDao.deleteLoesungszettel(loesungszettel);
                    anzahlLoesungszettel++;
                }

                kindDao.deleteKind(kindEntity);
                anzahlKinder++;
            }

            klasseDao.deleteKlasse(klasseEntity);
            anzahlKlassen++;

        }

        String context = "alle Klassen der Schule " + schulkuerzel + " gelöscht. anzahlLoesungszettel="
                + anzahlLoesungszettel + ", anzahlKinder=" + anzahlKinder + ", anzahlKlassen=" + anzahlKlassen;
        auditEventService.recordAuditEvent(AuditEventType.SCHULE_KLASSEN_GELOESCHT, context);
    }

}
