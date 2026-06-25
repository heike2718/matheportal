package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Veranstalter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * VeranstalterEntity.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "veranstalter", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = VeranstalterEntity.FIND_BY_USER_UUID,
        query = "select v from VeranstalterEntity v where v.userUuid = :userUuid") })
public class VeranstalterEntity {

    /**
     * name dieser NamedQuery
     */
    public static final String FIND_BY_USER_UUID = "VeranstalterEntity.FIND_BY_USER_UUID";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // NOPMD id ist nun mal richtig hier.

    @Column(name = "user_uuid", nullable = false, length = 36)
    private String userUuid;

    @Column(nullable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private Veranstalter.TypEnum typ;

    @Column(name = "newsletter")
    private boolean newsletterEmpfaenger;

    @Column(name = "zugang_unterlagen", nullable = false)
    @Enumerated(EnumType.STRING)
    private Veranstalter.ZugangsstatusUnterlagenEnum zugangsberechtigungUnterlagen;

    @Column(name = "teilnahmekuerzel", length = 1000)
    private String teilnahmekuerzel;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private int version;
}
