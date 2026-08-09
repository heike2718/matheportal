package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;

import io.quarkus.security.identity.SecurityIdentity;

import org.hibernate.exception.ConstraintViolationException;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.ExcpetionUtils;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruRuntimeException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.kuerzelgenerierung.KuerzelGeneratorService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * PrivatpersonAnlegenDelegate. Übernimmt das Anlegen eines privaten Wettbewerbsdurchführenden.
 */
@Slf4j
@ApplicationScoped
public class PrivatpersonAnlegenDelegate {

    private static final int MAX_SAVE_RETRIES = 5;

    private final WettbewerbsdurchfuehrendeMappingDelegate mappingDelegate = new WettbewerbsdurchfuehrendeMappingDelegate();

    @Inject
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    @Inject
    KuerzelGeneratorService kuerzelGeneratorService;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    Clock clock;

    @Transactional
    Wettbewerbsdurchfuehrender privatpersonAnlegen() {

        for (int attempt = 1; attempt <= MAX_SAVE_RETRIES; attempt++) {
            try {

                final WettbewerbsdurchfuehrenderEntity entity = createWettbewerbsdurchfuehrendePrivatEntity();
                final WettbewerbsdurchfuehrenderEntity result = wettbewerbsdurchfuehrenderDao.saveEntity(entity);

                log.debug("anlegen hat nach Versuch {} geklappt", attempt);
                log
                        .info("privatperson angelegt - uuid = {}, teilnahmekuerzel = {}", result.getUserUuid(),
                                result.getPrivatkuerzel());

                return this.mappingDelegate
                        .mapToWettbewerbsdurchfuehrender(result, securityIdentity.getPrincipal().getName());

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

    WettbewerbsdurchfuehrenderEntity createWettbewerbsdurchfuehrendePrivatEntity() {

        final String privatkuerzel = kuerzelGeneratorService.generatePrivatteilnahmekuerzel();

        if (privatkuerzel == null) {
            throw new MinikaenguruRuntimeException(
                    "Es konnte nach 5 Versuchen kein neues eindeutiges Privatkürzel generiert werden.");

        }

        final LocalDateTime now = LocalDateTime.now(clock);

        return this.mappingDelegate
                .createWettbewerbsdurchfuehrendeEntity(securityIdentity.getPrincipal().getName(), privatkuerzel,
                        Wettbewerbsdurchfuehrungsart.PRIVAT, now);
    }

    private boolean isConstraintViolationExceptionWithUKName(final PersistenceException exception,
            final String ukName) {
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
