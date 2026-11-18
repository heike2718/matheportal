package de.mathejungalt.minikaenguru.anwendung.domain.schule;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.core.Response.Status;

import io.quarkus.security.identity.SecurityIdentity;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.faulttolerance.exceptions.TimeoutException;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import org.hibernate.exception.ConstraintViolationException;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.ExcpetionUtils;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruRuntimeException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.ResourceNotFoundException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Klasse;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.KlasseRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Person;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.SchuleWettbewerbskontext;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schulkollegium;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.schulkatalog.SchulkatalogService;
import de.mathejungalt.minikaenguru.anwendung.domain.shared.Loeschservice;
import de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen.TeilnahmeUtils;
import de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen.TeilnahmenService;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.UserDetails;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.AuthorizationKey;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.KuerzelZugriff;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderHttpException;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderRestClient;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.KlasseDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkollegiumDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.VertragAuftragsdatenverarbeitungDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KlasseEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchulkollegiumsmitgliedEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.TeilnahmeEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * SchuleService.
 */
@ApplicationScoped
@Slf4j
public final class SchuleService {

    @ConfigProperty(name = "client.id")
    String clientId;

    @ConfigProperty(name = "client.secret")
    String clientSecret;

    @Inject
    @RestClient
    AuthproviderRestClient authproviderRestClient;

    @Inject
    SchulkatalogService schulkatalogService;

    @Inject
    WettbewerbService wettbewerbService;

    @Inject
    TeilnahmenService teilnahmenService;

    @Inject
    Loeschservice loeschservice;

    @Inject
    SchulkollegiumDao schulkollegiumDao;

    @Inject
    KlasseDao klasseDao;

    @Inject
    VertragAuftragsdatenverarbeitungDao vertragAuftragsdatenverarbeitungDao;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    Clock clock;

    /**
     * Läd den Wettebwerbskontext der Schule mit diesem kuerzel.
     *
     * @param schuleId String
     * @return SchuleWettbewerbskontext
     */
    @KuerzelZugriff("schule: Wettbewerbskontext")
    public SchuleWettbewerbskontext loadWettbewerbskontext(@AuthorizationKey final String schuleId) {

        final Schule schule = schulkatalogService.loadSchulenByKuerzel(new String[] { schuleId }).getFirst();
        final List<TeilnahmeReferenz> teilnahmerefs = teilnahmenService.getTeilnahmeReferenzen(schuleId);
        final boolean vertragDSGVOVorhanden = vertragAuftragsdatenverarbeitungDao.schuleHasVertragDSGVO(schuleId);

        final Wettbewerb aktuellerWettbewerb = wettbewerbService.loadAktuellenWettbewerb();

        return new SchuleWettbewerbskontext()
                .schule(schule)
                .kollegen(new ArrayList<>())
                .teilnahmerefs(teilnahmerefs)
                .vertragDSGVOVorhanden(vertragDSGVOVorhanden)
                .anmeldestatus(TeilnahmeUtils.berechneAnmeldestatus(aktuellerWettbewerb, teilnahmerefs));
    }

    /**
     * Fragt die Kollegen des eingeloggten Users beim Authprovider ab.
     *
     * @param schuleId String
     * @return Schulkollegium
     */
    @KuerzelZugriff("schule: Kollegen")
    public Schulkollegium getKollegium(@AuthorizationKey final String schuleId) {

        final String ownUuid = securityIdentity.getPrincipal().getName();

        final List<SchulkollegiumsmitgliedEntity> kollegen = schulkollegiumDao
                .findAllForSchule(schuleId)
                .stream()
                .filter(k -> !k.getUserUuid().equals(ownUuid))
                .toList();

        final List<Person> personen = new ArrayList<>();

        for (final SchulkollegiumsmitgliedEntity kollege : kollegen) {
            final String name = loadKollege(kollege.getUserUuid());
            if (name != null) {
                personen.add(new Person().schulkuerzel(schuleId).fullName(name));
            }
        }

        return new Schulkollegium().schulkuerzel(schuleId).kollegium(personen);

    }

    /**
     * Fragt beim IAM den Namen der anmeldenden Person ab.
     *
     * @param schuleId String
     * @return Person
     */
    @KuerzelZugriff("schulteilnahme: anmeldende Person")
    public Person getAnmeldendePerson(@AuthorizationKey final String schuleId) {

        final TeilnahmeEntity teilnahmeEntity = teilnahmenService
                .findTeilnahmeEntityForTeilnahmekuerzelAktuellesWettbewerbsjahr(schuleId);

        if (teilnahmeEntity == null) {
            throw new ResourceNotFoundException("Diese Resource gibt es leider nicht oder nicht mehr.");
        }

        if (teilnahmeEntity.getAngemeldetDurch() != null) {
            return new Person().fullName(this.loadKollege(teilnahmeEntity.getAngemeldetDurch())).schulkuerzel(schuleId);
        }

        throw new ResourceNotFoundException("Diese Resource gibt es leider nicht oder nicht mehr.");
    }

    String loadKollege(final String userUuid) {

        final String nonce = UUID.randomUUID().toString();
        try {
            final UserDetails userDetails = authproviderRestClient
                    .getUserDetails(userUuid, clientId, clientSecret, nonce);

            if (userDetails == null) {
                log.warn("authprovider hat kein response payload gesendet! Abfrage kollege mit uuid={}", userUuid);
                return null;
            }
            return userDetails.getVorname() + " " + userDetails.getNachname();

        } catch (final AuthproviderHttpException e) {

            if (e.getStatus() < Status.BAD_REQUEST.getStatusCode()
                    || e.getStatus() > Status.INTERNAL_SERVER_ERROR.getStatusCode()) {
                log
                        .warn("status {} bei Kommunikation mit authprovider beim Abfragen fuer kollege {} (wird ignoriert)",
                                e.getStatus(), userUuid);
                return null;
            }

            if (Status.NOT_FOUND.getStatusCode() == e.getStatus()) {
                log.warn("USER mit uuid {} existiert nicht oder nicht mehr", userUuid);
                return null;
            }
            if (Status.INTERNAL_SERVER_ERROR.getStatusCode() == e.getStatus()) {
                log
                        .warn("authprovider hat ein Problem (INTERNAL_SERVER_ERROR) - kollege mit uuid {} wird ignoriert",
                                userUuid);
                return null;
            }
            throw e;
        } catch (TimeoutException | ProcessingException e) {
            log
                    .error("Timeout beim Abfragen des Namen fuer kollege {} (wird ignoriert): {}", userUuid,
                            e.getMessage(), e);
            return null;
        }
    }

    /**
     * Läd die Klassen der gegebenen Schule.
     *
     * @param schuleId String
     * @return List
     */
    @KuerzelZugriff("schule: klassen laden")
    public List<Klasse> loadKlassen(@AuthorizationKey final String schuleId) {
        return klasseDao.findKlassenBySchulkuerzel(schuleId).stream().map(this::mapFromDb).toList();
    }

    /**
     * Legt in der gegebenen Schule eine neue Klasse an.
     *
     * @param schuleId      String
     * @param klasseRequest KlasseRequest
     * @return Klasse
     */
    @KuerzelZugriff("schule: klasse anlegen")
    public Klasse klasseAnlegen(@AuthorizationKey final String schuleId, final KlasseRequest klasseRequest) {

        try {

            final String ownUuid = securityIdentity.getPrincipal().getName();
            final String uuid = UUID.randomUUID().toString();
            final LocalDateTime now = LocalDateTime.now(clock);

            final KlasseEntity entity = KlasseEntity
                    .builder()
                    .uuid(uuid)
                    .schulkuerzel(schuleId)
                    .name(klasseRequest.getName())
                    .createdAt(now)
                    .createdBy(ownUuid)
                    .updatedAt(now)
                    .updatedBy(ownUuid)
                    .build();

            klasseDao.insertKlasse(entity);

            return this.mapFromDb(entity);
        } catch (RuntimeException e) {
            if (this.isConstraintViolationExceptionWithUKName(e, KlasseEntity.UK_NAME_KLASSEN)) {
                throw new MinikaenguruConflictException("In dieser Schule gibt es bereits eine Klasse gleichen Namens.",
                        e);
            }
            throw new MinikaenguruRuntimeException(
                    "Beim Anlegen einer Klasse ist ein Fehler aufgetreten: " + e.getMessage(), e);
        }
    }

    /**
     * Löscht kaskadierend alle Klassen einer Schule, also inklusive Kindern und Lösungszetteln.
     *
     * @param schuleId String
     */
    @KuerzelZugriff("schule: alle klassen löschen")
    public void alleKlassenLoeschen(@AuthorizationKey final String schuleId) {
        this.loeschservice.alleKlassenEinerSchuleLoeschen(schuleId);
    }

    /**
     * Läd die Klasse mit der gegebenen klasseId
     *
     * @param schuleId String
     * @param klasseId String
     * @return Klasse
     */
    @KuerzelZugriff("schule: klasse laden")
    public Klasse loadKlasse(@AuthorizationKey final String schuleId, final String klasseId) {

        final KlasseEntity entity = klasseDao.findKlasseByPrimaryKey(klasseId);

        if (entity == null) {
            throw new ResourceNotFoundException("Diese Klasse gibt es nicht");
        }

        return this.mapFromDb(entity);
    }

    /**
     * Ändert den Namen der Klasse.
     *
     * @param schuleId      String
     * @param klasseId      String
     * @param klasseRequest KlasseRequest
     * @return Klasse
     */
    @KuerzelZugriff("schule: klasse ändern")
    public Klasse klasseAendern(@AuthorizationKey final String schuleId, final String klasseId,
            final KlasseRequest klasseRequest) {

        final KlasseEntity entity = klasseDao.findKlasseByPrimaryKey(klasseId);

        if (entity == null) {
            throw new ResourceNotFoundException("Diese Klasse gibt es nicht");
        }

        try {
            entity.setUpdatedAt(LocalDateTime.now(clock));
            entity.setUpdatedBy(securityIdentity.getPrincipal().getName());
            entity.setName(klasseRequest.getName());

            klasseDao.updateKlasse(entity);

            return this.mapFromDb(entity);

        } catch (RuntimeException e) {
            if (this.isConstraintViolationExceptionWithUKName(e, KlasseEntity.UK_NAME_KLASSEN)) {
                throw new MinikaenguruConflictException("In dieser Schule gibt es bereits eine Klasse gleichen Namens.",
                        e);
            }
            throw new MinikaenguruRuntimeException(
                    "Beim Ändern einer Klasse ist ein Fehler aufgetreten: " + e.getMessage(), e);
        }
    }

    /**
     * Löscht die gegebene Klasse
     *
     * @param schuleId String
     * @param klasseId Strin
     */
    @KuerzelZugriff("schule: klasse löschen")
    public void klasseLoeschen(@AuthorizationKey final String schuleId, final String klasseId) {
        this.loeschservice.klasseLoeschen(klasseId);
    }

    private Klasse mapFromDb(final KlasseEntity entity) {
        return new Klasse().name(entity.getName()).schulkuerzel(entity.getSchulkuerzel()).uuid(entity.getUuid());
    }

    private boolean isConstraintViolationExceptionWithUKName(final RuntimeException exception, final String ukName) {
        final Optional<ConstraintViolationException> opt = ExcpetionUtils
                .findCause(exception, ConstraintViolationException.class);

        if (opt.isPresent()) {
            final ConstraintViolationException cve = opt.get();
            if (ukName.equals(cve.getConstraintName())) {
                return true;
            }

        }
        return false;
    }
}
