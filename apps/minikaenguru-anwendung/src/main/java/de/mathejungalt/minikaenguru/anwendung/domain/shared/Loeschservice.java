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

        final List<KlasseEntity> klassen = klasseDao.findKlassenBySchulkuerzel(schulkuerzel);

        int anzahlKlassen = 0;
        int anzahlKinder = 0;
        int anzahlLoesungszettel = 0;

        for (final KlasseEntity klasseEntity : klassen) {

            final List<KindEntity> kinder = kindDao.findKinderByKlasseId(klasseEntity.getUuid());

            for (final KindEntity kindEntity : kinder) {

                if (kindEntity.getLoesungszettelId() != null) {
                    final LoesungszettelEntity loesungszettel = loesungszettelDao
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

        final String context = "alle Klassen der Schule " + schulkuerzel + " gelöscht. anzahlLoesungszettel="
                + anzahlLoesungszettel + ", anzahlKinder=" + anzahlKinder + ", anzahlKlassen=" + anzahlKlassen;
        auditEventService.recordAuditEvent(AuditEventType.SCHULE_KLASSEN_GELOESCHT, context);
    }

    /**
     * Löscht die Klasse mit der gegebenen id und alle Kinder nebst Lösungszetteln
     *
     * @param klasseId String
     */
    @Transactional
    public void klasseLoeschen(final String klasseId) {
        final KlasseEntity klasseEntity = klasseDao.findKlasseByPrimaryKey(klasseId);

        if (klasseEntity == null) {
            return;
        }

        int anzahlKinder = 0;
        int anzahlLoesungszettel = 0;

        final List<KindEntity> kinder = kindDao.findKinderByKlasseId(klasseEntity.getUuid());

        for (final KindEntity kindEntity : kinder) {
            if (kindEntity.getLoesungszettelId() != null) {
                final LoesungszettelEntity loesungszettel = loesungszettelDao
                        .findByPrimaryKey(kindEntity.getLoesungszettelId());
                loesungszettelDao.deleteLoesungszettel(loesungszettel);
                anzahlLoesungszettel++;
            }

            kindDao.deleteKind(kindEntity);
            anzahlKinder++;
        }

        klasseDao.deleteKlasse(klasseEntity);

        final String context = "Klasse " + klasseEntity.getName() + " der Schule " + klasseEntity.getSchulkuerzel()
                + " gelöscht. anzahlLoesungszettel=" + anzahlLoesungszettel + ", anzahlKinder=" + anzahlKinder;
        auditEventService.recordAuditEvent(AuditEventType.KLASSE_GELOESCHT, context);
    }
}
