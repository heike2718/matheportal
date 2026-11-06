package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Klassenstufe;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Sprache;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * KindEntity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "kinder", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = KindEntity.COUNT_BY_TEILNAHMEKUERZEL,
        query = "select count(k) from KindEntity k where k.teilnahmekuerzel = :teilnahmekuerzel") })
@SuppressWarnings("CPD-START")
public class KindEntity {

    public static final String COUNT_BY_TEILNAHMEKUERZEL = "KindEntity.COUNT_BY_TEILNAHMEKUERZEL";

    @Id
    @Column(name = "uuid", nullable = false, length = 36)
    private String uuid;

    @Column(name = "teilnahmekuerzel", nullable = false, length = 10)
    @EqualsAndHashCode.Exclude
    private String teilnahmekuerzel;

    @Column(name = "teilnahmeart", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private Wettbewerbsdurchfuehrungsart teilnahmeart;

    @Column(name = "klassenstufe", nullable = false)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private Klassenstufe klassenstufe;

    @Column(name = "sprache", nullable = false, length = 3)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private Sprache sprache;

    @Column(name = "vorname", nullable = false, length = 55)
    @EqualsAndHashCode.Exclude
    private String vorname;

    @Column(name = "nachname", nullable = true, length = 55)
    @EqualsAndHashCode.Exclude
    private String nachname;

    @Column(name = "zusatz", nullable = true, length = 55)
    @EqualsAndHashCode.Exclude
    private String zusatz;

    @Column(name = "klasse_id", nullable = true, length = 36)
    @EqualsAndHashCode.Exclude
    private String klasseId;

    @Column(name = "kuerzel_land", nullable = true, length = 5)
    @EqualsAndHashCode.Exclude
    private String kuerzelLand;

    @Column(name = "klassenstufe_pruefen", nullable = false)
    @EqualsAndHashCode.Exclude
    private boolean klassenstufePruefen;

    @Column(name = "dublette_pruefen", nullable = false)
    @EqualsAndHashCode.Exclude
    private boolean dublettePruefen;

    @Column(name = "importiert", nullable = false)
    @EqualsAndHashCode.Exclude
    private boolean importiert;

    @Column(name = "loesungszettel_id", nullable = true)
    @EqualsAndHashCode.Exclude
    private Long loesungszettelId;

    @Column(name = "created_at", nullable = false, updatable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LocalDateTime createdAt;

    @Column(name = "created_by", nullable = true, length = 36)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String createdBy;

    @Column(name = "updated_at", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", nullable = true, length = 36)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String updatedBy;

    @Version
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private int version;
}
