package de.mathejungalt.authsessions.internal.session;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.egladil_secure_tokens.SecureRandomGenerator;
import de.mathejungalt.authsessions.api.AuthenticatedUser;
import de.mathejungalt.authsessions.api.SecurityIdentityAugmentationState;
import de.mathejungalt.authsessions.api.SessionDto;
import de.mathejungalt.authsessions.api.SessionValidationFailedReason;
import de.mathejungalt.authsessions.api.exceptions.AuthSessionException;
import de.mathejungalt.authsessions.api.exceptions.SessionValidationFailedException;
import de.mathejungalt.authsessions.internal.session.entities.SessionEntity;

/**
 * SessionService.
 */
@ApplicationScoped
public class SessionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionService.class);

    private final SecureRandomGenerator secureRandomGenerator = new SecureRandomGenerator();

    @Inject
    SessionStateEvaluator sessionStateEvaluator;

    @Inject
    SessionRepository sessionRepository;

    @Inject
    Clock clock;

    /**
     * Erzeugt und persistiert eine Session.
     *
     * @param authenticatedUser  AuthenticatedUser
     * @param idleTimeoutMinutes int
     * @return SessionDto
     * @throws AuthSessionException wenn es einen unerwarteten Implementierungsfehler oder einen Fehler beim Speichern
     *                              gibt.
     */
    public SessionDto createSession(final AuthenticatedUser authenticatedUser, final int idleTimeoutMinutes)
            throws AuthSessionException {

        try {

            final LocalDateTime now = LocalDateTime.now(clock);
            final LocalDateTime expiresAt = now.plusMinutes(idleTimeoutMinutes);
            final String sessionId = secureRandomGenerator.generateSecureRandomHex(32);

            final SessionEntity sessionEntity = SessionEntity
                    .builder()
                    .createdAt(now)
                    .expiresAt(expiresAt)
                    .sessionId(sessionId)
                    .fullName(authenticatedUser.getFullName())
                    .userUuid(authenticatedUser.getUuid())
                    .berechtigungen(toCsv(authenticatedUser.getBerechtigungen()))
                    .augmentationState(SecurityIdentityAugmentationState.NOT_AUGMENTED)
                    .build();

            sessionRepository.saveSession(sessionEntity);

            return SessionDto.builder().sessionId(sessionId).authenticatedUser(authenticatedUser).build();

        } catch (final Exception e) {

            throw new AuthSessionException("unerwarteter Fehler beim Anlegen einer Session.", e);

        }
    }

    /**
     * Läd die Session und verlängert sie, falls möglich.<br>
     * <br>
     * Die Session kann nicht verlängert werden, wenn sie bereits abgelaufen ist (zu lange idle) oder ihre maximale
     * Lebensspanne überschritten hat.
     *
     * @param sessionId          String
     * @param idleTimeoutMinutes int Anzahl Minuten der Untätigkeit.
     * @param maxLifetimeMinutes int maximal mögliche Lebensdauer einer Session in Minuten.
     * @return SessionDto
     * @throws SessionValidationFailedException wenn es keine Session gibt, diese abgelaufen ist oder sich nicht mehr
     *                                          verlängern lässt.
     * @throws AuthSessionException             wenn es beim Speichern der Session zu einem Fehler kam.
     */
    @Transactional(dontRollbackOn = SessionValidationFailedException.class)
    public SessionDto reloadSession(final String sessionId, final int idleTimeoutMinutes, final int maxLifetimeMinutes)
            throws SessionValidationFailedException, AuthSessionException {

        final SessionEntity sessionEntity = sessionRepository
                .findBySessionId(sessionId)
                .orElseThrow(() -> new SessionValidationFailedException(SessionValidationFailedReason.MISSING));

        final boolean extendable = isSessionExtendable(sessionEntity, maxLifetimeMinutes);

        if (!extendable) {
            LOGGER.debug("session des users {} ist abgelaufen", sessionEntity.getUserUuid());
            throw new SessionValidationFailedException(SessionValidationFailedReason.EXPIRED);
        }

        return internalExtendSession(sessionEntity, idleTimeoutMinutes);
    }

    SessionDto internalExtendSession(final SessionEntity sessionEntity, final int idleTimeoutMinutes) {
        try {
            final LocalDateTime now = LocalDateTime.now(clock);
            sessionEntity.setExpiresAt(now.plusMinutes(idleTimeoutMinutes));
            sessionRepository.saveSession(sessionEntity);

            return SessionDto
                    .builder()
                    .sessionId(sessionEntity.getSessionId())
                    .augmentationState(sessionEntity.getAugmentationState())
                    .authenticatedUser(AuthenticatedUser
                            .builder()
                            .uuid(sessionEntity.getUserUuid())
                            .fullName(sessionEntity.getFullName())
                            .berechtigungen(parseBerechtigungen(sessionEntity.getBerechtigungen()))
                            .build())
                    .build();

        } catch (final PersistenceException e) {
            throw new AuthSessionException("unerwarteter Fehler beim Verlaengern der Session", e);
        }
    }

    /**
     * Entfernt die Session aus dem Store. Eine PersistenceException wird nur geloggt.
     *
     * @param sessionId String
     */
    public void invalidateSession(final String sessionId) {
        try {

            sessionRepository.deleteBySessionId(sessionId);
        } catch (final PersistenceException e) {
            LOGGER.error("session mit sessionId {} konnte nicht gelöscht werden: {}", sessionId, e.getMessage(), e);
        }

    }

    private String toCsv(final Set<String> berechtigungen) {
        if (berechtigungen == null || berechtigungen.isEmpty()) {
            return "";
        }
        return String.join(",", berechtigungen);
    }

    private Set<String> parseBerechtigungen(final String berechtigungenCsv) {
        if (berechtigungenCsv == null || berechtigungenCsv.isBlank()) {
            return Set.of();
        }

        return Set
                .of(berechtigungenCsv.split(","))
                .stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toUnmodifiableSet());
    }

    private boolean isSessionExtendable(final SessionEntity session, final int maxLifetimeMinutes) {
        final LocalDateTime now = LocalDateTime.now(clock);

        if (now.isAfter(session.getExpiresAt())) {
            return false;
        }

        return !now.isAfter(session.getCreatedAt().plusMinutes(maxLifetimeMinutes));
    }

    /**
     * Speichert die session mit den neuen berechtigungen.
     *
     * @param sessionId      String
     * @param berechtigungen Set
     */
    @Transactional
    public void augmentSessionQuietly(final String sessionId, final Set<String> berechtigungen) {
        final Optional<SessionEntity> opt = sessionRepository.findBySessionId(sessionId);
        if (opt.isEmpty()) {
            LOGGER.debug("session ist nicht mehr da");
        }
        final SessionEntity sessionEntity = opt.get();
        final String roles = String.join(",", berechtigungen);
        sessionEntity.setBerechtigungen(roles);
        sessionEntity.setAugmentationState(SecurityIdentityAugmentationState.AUGMENTED);
        sessionRepository.saveSession(sessionEntity);
        LOGGER.warn("====> session has been augmented: {}", roles);
    }

    /**
     * Speichert die session mit dem Status NO_AUGMENTATION.
     *
     * @param sessionId String
     */
    public void markSessionAugmentationChecked(final String sessionId) {
        final Optional<SessionEntity> opt = sessionRepository.findBySessionId(sessionId);
        if (opt.isEmpty()) {
            LOGGER.debug("session ist nicht mehr da");
        }
        final SessionEntity sessionEntity = opt.get();
        sessionEntity.setAugmentationState(SecurityIdentityAugmentationState.NO_AUGMENTATION);
        sessionRepository.saveSession(sessionEntity);
    }
}
