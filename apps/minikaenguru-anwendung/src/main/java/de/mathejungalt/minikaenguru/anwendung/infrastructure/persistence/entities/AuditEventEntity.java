package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventType;

import lombok.Builder;
import lombok.Getter;

/**
 * AuditEventEntity.
 */
@Getter
@Builder
@Entity
@Table(name = "audit_events", schema = "minikaenguru")
public class AuditEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final Long id; // NOPMD id ist nun mal richtig hier.

    @Column(name = "event_type", nullable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private final AuditEventType eventType;

    @Column(name = "user_uuid", nullable = false, updatable = false, length = 36)
    private final String userUuid;

    @Column(name = "context", nullable = false, updatable = false, length = 1000)
    private final String context;

    @Column(name = "created_at", nullable = false, updatable = false)
    private final LocalDateTime createdAt;

}
