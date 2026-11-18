package de.mathejungalt.minikaenguru.anwendung.domain.shared;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventService;
import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventType;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.KindDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.KlasseDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.LoesungszettelDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KindEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KlasseEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.LoesungszettelEntity;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * LoeschserviceTest.
 */
@ExtendWith(MockitoExtension.class)
public class LoeschserviceTest {

    @Mock
    AuditEventService auditEventService;

    @Mock
    LoesungszettelDao loesungszettelDao;

    @Mock
    KindDao kindDao;

    @Mock
    KlasseDao klasseDao;

    @Mock
    SecurityIdentity securityIdentity;

    @InjectMocks
    Loeschservice loeschservice;

    @Test
    void should_alleKlassenEinerSchuleLoeschen_work() {

        // arrange
        final String schulkuerzel = "S1234567";
        final String uuidKlasseA = "aaaaaa";
        final String uuidKlasseB = "bbbbbb";
        final List<KlasseEntity> klassen = new ArrayList<>();
        final List<KindEntity> kinderKlasseA = new ArrayList<>();
        final List<KindEntity> kinderKlasseB = new ArrayList<>();

        klassen.add(KlasseEntity.builder().uuid(uuidKlasseA).build());
        klassen.add(KlasseEntity.builder().uuid(uuidKlasseB).build());

        kinderKlasseA
                .add(KindEntity.builder().klasseId(uuidKlasseA).uuid("kind-1-klasse-a").loesungszettelId(1L).build());
        kinderKlasseA.add(KindEntity.builder().klasseId(uuidKlasseA).uuid("kind-2-klasse-a").build());

        kinderKlasseB
                .add(KindEntity.builder().klasseId(uuidKlasseB).uuid("kind-1-klasse-b").loesungszettelId(2L).build());
        kinderKlasseB
                .add(KindEntity.builder().klasseId(uuidKlasseB).uuid("kind-1-klasse-b").loesungszettelId(3L).build());

        LoesungszettelEntity loesungszettelEntity = LoesungszettelEntity.builder().id(42L).build();

        when(klasseDao.findKlassenBySchulkuerzel(schulkuerzel)).thenReturn(klassen);
        when(kindDao.findKinderByKlasseId(uuidKlasseA)).thenReturn(kinderKlasseA);
        when(kindDao.findKinderByKlasseId(uuidKlasseB)).thenReturn(kinderKlasseB);

        when(loesungszettelDao.findByPrimaryKey(anyLong())).thenReturn(loesungszettelEntity);

        doNothing().when(loesungszettelDao).deleteLoesungszettel(any(LoesungszettelEntity.class));
        doNothing().when(kindDao).deleteKind(any(KindEntity.class));
        doNothing().when(klasseDao).deleteKlasse(any(KlasseEntity.class));

        doNothing().when(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

        // act
        loeschservice.alleKlassenEinerSchuleLoeschen(schulkuerzel);

        // assert
        verify(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());
        verify(klasseDao).findKlassenBySchulkuerzel(schulkuerzel);
        verify(kindDao).findKinderByKlasseId(uuidKlasseA);
        verify(kindDao).findKinderByKlasseId(uuidKlasseB);
        verify(loesungszettelDao, times(3)).findByPrimaryKey(anyLong());
        verify(loesungszettelDao, times(3)).findByPrimaryKey(anyLong());
        verify(kindDao, times(4)).deleteKind(any(KindEntity.class));
        verify(klasseDao, times(2)).deleteKlasse(any(KlasseEntity.class));
    }

    @Test
    void should_alleKlassenEinerSchuleLoeschen_work_when_klasse_ohne_kinder() {

        // arrange
        final String schulkuerzel = "S1234567";
        final String uuidKlasseA = "aaaaaa";
        final String uuidKlasseB = "bbbbbb";
        final List<KlasseEntity> klassen = new ArrayList<>();
        final List<KindEntity> kinderKlasseA = new ArrayList<>();

        klassen.add(KlasseEntity.builder().uuid(uuidKlasseA).build());
        klassen.add(KlasseEntity.builder().uuid(uuidKlasseB).build());

        kinderKlasseA
                .add(KindEntity.builder().klasseId(uuidKlasseA).uuid("kind-1-klasse-a").loesungszettelId(1L).build());
        kinderKlasseA.add(KindEntity.builder().klasseId(uuidKlasseA).uuid("kind-2-klasse-a").build());

        LoesungszettelEntity loesungszettelEntity = LoesungszettelEntity.builder().id(42L).build();

        when(klasseDao.findKlassenBySchulkuerzel(schulkuerzel)).thenReturn(klassen);
        when(kindDao.findKinderByKlasseId(uuidKlasseA)).thenReturn(kinderKlasseA);
        when(kindDao.findKinderByKlasseId(uuidKlasseB)).thenReturn(new ArrayList<>());

        when(loesungszettelDao.findByPrimaryKey(anyLong())).thenReturn(loesungszettelEntity);

        doNothing().when(loesungszettelDao).deleteLoesungszettel(any(LoesungszettelEntity.class));
        doNothing().when(kindDao).deleteKind(any(KindEntity.class));
        doNothing().when(klasseDao).deleteKlasse(any(KlasseEntity.class));

        doNothing().when(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

        // act
        loeschservice.alleKlassenEinerSchuleLoeschen(schulkuerzel);

        // assert
        verify(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());
        verify(klasseDao).findKlassenBySchulkuerzel(schulkuerzel);
        verify(kindDao).findKinderByKlasseId(uuidKlasseA);
        verify(kindDao).findKinderByKlasseId(uuidKlasseB);
        verify(loesungszettelDao, times(1)).findByPrimaryKey(anyLong());
        verify(loesungszettelDao, times(1)).findByPrimaryKey(anyLong());
        verify(kindDao, times(2)).deleteKind(any(KindEntity.class));
        verify(klasseDao, times(2)).deleteKlasse(any(KlasseEntity.class));
    }

    @Test
    void should_klasse_loeschen_work() {

        // arrange
        final String schulkuerzel = "S1234567";
        final String uuidKlasseA = "aaaaaa";
        final KlasseEntity klasseA = KlasseEntity.builder().uuid(uuidKlasseA).schulkuerzel(schulkuerzel).build();
        final List<KindEntity> kinderKlasseA = new ArrayList<>();

        kinderKlasseA
                .add(KindEntity.builder().klasseId(uuidKlasseA).uuid("kind-1-klasse-a").loesungszettelId(1L).build());
        kinderKlasseA.add(KindEntity.builder().klasseId(uuidKlasseA).uuid("kind-2-klasse-a").build());

        LoesungszettelEntity loesungszettelEntity = LoesungszettelEntity.builder().id(42L).build();

        when(klasseDao.findKlasseByPrimaryKey(uuidKlasseA)).thenReturn(klasseA);
        when(kindDao.findKinderByKlasseId(uuidKlasseA)).thenReturn(kinderKlasseA);

        when(loesungszettelDao.findByPrimaryKey(anyLong())).thenReturn(loesungszettelEntity);

        doNothing().when(loesungszettelDao).deleteLoesungszettel(any(LoesungszettelEntity.class));
        doNothing().when(kindDao).deleteKind(any(KindEntity.class));
        doNothing().when(klasseDao).deleteKlasse(any(KlasseEntity.class));

        doNothing().when(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

        // act
        loeschservice.klasseLoeschen(uuidKlasseA);

        // assert
        verify(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());
        verify(klasseDao).findKlasseByPrimaryKey(uuidKlasseA);
        verify(kindDao).findKinderByKlasseId(uuidKlasseA);
        verify(loesungszettelDao, times(1)).findByPrimaryKey(anyLong());
        verify(loesungszettelDao, times(1)).findByPrimaryKey(anyLong());
        verify(kindDao, times(2)).deleteKind(any(KindEntity.class));
        verify(klasseDao, times(1)).deleteKlasse(any(KlasseEntity.class));

    }

    @Test
    void should_klasse_loeschen_work_when_klasse_not_found() {

        // arrange
        final String uuidKlasseA = "aaaaaa";
        when(klasseDao.findKlasseByPrimaryKey(uuidKlasseA)).thenReturn(null);

        // act
        loeschservice.klasseLoeschen(uuidKlasseA);

        // assert
        verify(auditEventService, never()).recordAuditEvent(any(AuditEventType.class), anyString());
        verify(klasseDao).findKlasseByPrimaryKey(uuidKlasseA);
        verify(kindDao, never()).findKinderByKlasseId(uuidKlasseA);
        verify(loesungszettelDao, never()).findByPrimaryKey(anyLong());
        verify(kindDao, never()).deleteKind(any(KindEntity.class));
        verify(klasseDao, never()).deleteKlasse(any(KlasseEntity.class));
    }
}
