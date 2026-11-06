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

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Klassenstufe;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.QuelleLoesungszettel;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Sprache;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "loesungszettel", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = LoesungszettelEntity.COUNT_BY_TEILNAHMEKUERZEL_AND_JAHR,
        query = "select count(l) from LoesungszettelEntity l where l.teilnahmekuerzel = :teilnahmekuerzel and l.jahr = :jahr") })
@SuppressWarnings("CPD-START")
public class LoesungszettelEntity {

    public static final String COUNT_BY_TEILNAHMEKUERZEL_AND_JAHR = "LoesungszettelEntity.COUNT_BY_TEILNAHMEKUERZEL_AND_JAHR";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // NOPMD id ist nun mal richtig hier.

    @Column(name = "jahr")
    @EqualsAndHashCode.Exclude
    private Integer jahr;

    @Column(name = "teilnahmekuerzel", nullable = false, length = 10)
    @EqualsAndHashCode.Exclude
    private String teilnahmekuerzel;

    @Column(name = "teilnahmeart", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private Wettbewerbsdurchfuehrungsart teilnahmeart;

    @Column(name = "kind_id", nullable = true, length = 36)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String kindId;

    @Column(name = "klassenstufe", nullable = false)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private Klassenstufe klassenstufe;

    @Column(name = "punkte", nullable = false)
    @EqualsAndHashCode.Exclude
    private Integer punkte;

    @Column(name = "kaengurusprung", nullable = false)
    @EqualsAndHashCode.Exclude
    private Integer kaengurusprung;

    @Column(name = "kuerzel_land", nullable = true, length = 5)
    @EqualsAndHashCode.Exclude
    private String kuerzelLand;

    @Column(name = "sprache", nullable = false, length = 3)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private Sprache sprache;

    @Column(name = "quelle", nullable = false, length = 6)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private QuelleLoesungszettel quelle;

    @Column(name = "nutzereingabe", nullable = true, length = 15)
    @EqualsAndHashCode.Exclude
    private String nutzereingabe;

    @Column(name = "antwortcode", nullable = true, length = 15)
    @EqualsAndHashCode.Exclude
    private String antwortcode;

    @Column(name = "wertungscode", nullable = false, length = 15)
    @EqualsAndHashCode.Exclude
    private String wertungscode;

    @Column(name = "typo", nullable = false)
    @EqualsAndHashCode.Exclude
    private boolean typo;

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
