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

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * WettbewerbsdurchfuehrenderEntity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "wettbewerbsdurchfuehrende", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = WettbewerbsdurchfuehrenderEntity.FIND_BY_USER_UUID,
        query = "select d from WettbewerbsdurchfuehrenderEntity d where d.userUuid = :userUuid") })
public class WettbewerbsdurchfuehrenderEntity {

    /**
     * name dieser NamedQuery.
     */
    public static final String FIND_BY_USER_UUID = "WettbewerbsdurchfuehrenderEntity.FIND_BY_USER_UUID";

    /**
     * Name des uk für die Spalte privatkuerzel
     */
    public static final String UK_NAME_PRIVATKUERZEL = "uk_wettbewerbsdurchfuehrende_privatkuerzel";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Exclude
    private Long id; // NOPMD id ist nun mal richtig hier.

    @Column(name = "user_uuid", nullable = false, length = 36)
    private String userUuid;

    @Column(name = "typ", nullable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private Wettbewerbsdurchfuehrungsart art;

    @Column(name = "newsletter")
    @EqualsAndHashCode.Exclude
    private boolean newsletterEmpfaenger;

    @Column(name = "zugang_unterlagen", nullable = false)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private ZugangsberechtigungUnterlagen zugangsberechtigungUnterlagen;

    @Column(name = "schulkuerzel", length = 1000)
    @EqualsAndHashCode.Exclude
    private String schulkuerzel;

    @Column(name = "privatkuerzel", length = 10)
    @EqualsAndHashCode.Exclude
    private String privatkuerzel;

    @Column(name = "created_at", nullable = false, updatable = false)
    @EqualsAndHashCode.Exclude
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @EqualsAndHashCode.Exclude
    private LocalDateTime updatedAt;

    @Version
    @EqualsAndHashCode.Exclude
    private int version;

    @Override
    public String toString() {
        return "WettbewerbsdurchfuehrenderEntity [id=" + id + ", userUuid=" + userUuid + ", typ=" + art
                + ", newsletterEmpfaenger=" + newsletterEmpfaenger + ", zugangsberechtigungUnterlagen="
                + zugangsberechtigungUnterlagen + "]";
    }

}
