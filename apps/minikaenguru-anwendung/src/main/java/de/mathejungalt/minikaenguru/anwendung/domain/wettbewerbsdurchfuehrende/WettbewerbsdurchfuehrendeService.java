package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;

import io.quarkus.security.identity.SecurityIdentity;

import org.hibernate.exception.ConstraintViolationException;

import org.apache.commons.lang3.StringUtils;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.ExcpetionUtils;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruRuntimeException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;
import de.mathejungalt.minikaenguru.anwendung.domain.kuerzelgenerierung.KuerzelGeneratorService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * WettbewerbsdurchfuehrendeService.
 */
@Slf4j
@ApplicationScoped
public class WettbewerbsdurchfuehrendeService {

    private static final int MAX_SAVE_RETRIES = 5;

    @Inject
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    @Inject
    KuerzelGeneratorService kuerzelGeneratorService;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    Clock clock;

    /**
     * Läd den Wettbewerbsdurchfuehrenden anhand der userUuid aus der SecurityIdentity.
     *
     * @return Wettbewerbsdurchfuehrender oder null
     */
    @Transactional
    public Wettbewerbsdurchfuehrender loadDurchfuehrenden() {

        final Optional<WettbewerbsdurchfuehrenderEntity> opt = wettbewerbsdurchfuehrenderDao
                .findByUserUuid(securityIdentity.getPrincipal().getName());

        if (opt.isPresent()) {
            return mapToWettbewerbsdurchfuehrender(opt.get());
        }

        return null;
    }

    /**
     * Legt einen Wettbewerbsdurchfuehrenden mit Typ PRIVAT an.
     *
     * @return Wettbewerbsdurchfuehrender
     */
    public Wettbewerbsdurchfuehrender privatpersonAnlegen() {

        if (loadDurchfuehrenden() != null) {
            throw new MinikaenguruConflictException(
                    "Dieser Benutzer ist bereits als Wettbewerbsdurchführender registriert");
        }

        for (int attempt = 1; attempt <= MAX_SAVE_RETRIES; attempt++) {
            try {

                final WettbewerbsdurchfuehrenderEntity entity = createWettbewerbsdurchfuehrendePrivatEntity();
                final WettbewerbsdurchfuehrenderEntity result = wettbewerbsdurchfuehrenderDao.saveEntity(entity);

                log.debug("anlegen hat nach Versuch {} geklappt", attempt);

                return mapToWettbewerbsdurchfuehrender(result);

            } catch (final PersistenceException e) {

                if (isConstraintViolationExceptionWithUKName(e,
                        WettbewerbsdurchfuehrenderEntity.UK_NAME_PRIVATKUERZEL)) {
                    continue;
                } else {
                    throw new MinikaenguruRuntimeException(
                            "Beim Anlegen einer Privatperson ist ein Fehler aufgetreten: " + e.getMessage(), e);
                }
            }
        }
        throw new MinikaenguruRuntimeException("Konnte nach " + MAX_SAVE_RETRIES
                + " Versuchen kein eindeutiges privatkuerzel für wettbewerbsdurchfuegernden generieren, gebe auf");
    }

    Wettbewerbsdurchfuehrender mapToWettbewerbsdurchfuehrender(final WettbewerbsdurchfuehrenderEntity result) {

        final Set<String> teilnahmenummern = new HashSet<>();

        switch (result.getTyp()) {
        case PRIVAT:
            teilnahmenummern.add(result.getPrivatkuerzel());
            break;
        case SCHULE:
            teilnahmenummern.addAll(Arrays.stream(StringUtils.split(result.getSchulkuerzel(), ",")).toList());
            break;
        default:
            throw new IllegalStateException("unerwarteter Typ " + result.getTyp()
                    + " in wettbewerbsdurchfuehrende mit user_uuid = " + securityIdentity.getPrincipal().getName());
        }

        return new Wettbewerbsdurchfuehrender()
                .durchfuehrungsart(result.getTyp())
                .teilnahmenummern(teilnahmenummern)
                .zugangsberechtigungUnterlagen(result.getZugangsberechtigungUnterlagen())
                .newsletter(result.isNewsletterEmpfaenger());
    }

    WettbewerbsdurchfuehrenderEntity createWettbewerbsdurchfuehrendePrivatEntity() {

        final String privatkuerzel = kuerzelGeneratorService.generatePrivatteilnahmekuerzel();

        if (privatkuerzel == null) {
            throw new MinikaenguruRuntimeException(
                    "Es konnte nach 5 Versuchen kein neues eindeutiges Privatkürzel generiert werden.");
        }

        final LocalDateTime now = LocalDateTime.now(clock);

        final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                .builder()
                .privatkuerzel(privatkuerzel)
                .userUuid(securityIdentity.getPrincipal().getName())
                .typ(Wettbewerbsdurchfuehrungsart.PRIVAT)
                .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.STANDARD)
                .createdAt(now)
                .updatedAt(now)
                .build();
        return entity;
    }

    private boolean isConstraintViolationExceptionWithUKName(final PersistenceException exception,
            final String ukName) {
        final Optional<ConstraintViolationException> opt = ExcpetionUtils
                .findCause(exception, ConstraintViolationException.class);

        if (opt.isPresent()) {
            final ConstraintViolationException cve = opt.get();
            if (WettbewerbsdurchfuehrenderEntity.UK_NAME_PRIVATKUERZEL.equals(cve.getConstraintName())) {
                return true;
            }

        }
        return false;
    }
}
