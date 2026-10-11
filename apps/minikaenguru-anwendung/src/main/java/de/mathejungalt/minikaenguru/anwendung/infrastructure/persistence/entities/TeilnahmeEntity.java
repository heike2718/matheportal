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

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Auswertungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;

import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode
@Entity
@Table(name = "teilnahmen", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(name = TeilnahmeEntity.FIND_REFS_BY_TEILNAHMEKUERZEL, query = """
        select new de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz(
            t.jahr, t.teilnahmekuerzel)
        from TeilnahmeEntity t
        where t.teilnahmekuerzel = :teilnahmekuerzel
        order by t.jahr desc
        """) })
public class TeilnahmeEntity {

    /** Name dieser NamedQuery. */
    public static final String FIND_REFS_BY_TEILNAHMEKUERZEL = "TeilnahmeEntity.FIND_REFS_BY_TEILNAHMEKUERZEL";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Exclude
    private Long id; // NOPMD id ist nun mal richtig hier.

    @Column(name = "jahr", nullable = false)
    private Integer jahr;

    @Column(name = "teilnahmekuerzel", nullable = false)
    private String teilnahmekuerzel;

    @Column(name = "teilnahmeart", nullable = false)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private Wettbewerbsdurchfuehrungsart teilnahmeart;

    @Column(name = "auswertungsart")
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Exclude
    private Auswertungsart auswertungsart;

    @Column(name = "angemeldet_durch")
    @EqualsAndHashCode.Exclude
    private String angemeldetDurch;

    @Column(name = "created_at", nullable = false, updatable = false)
    @EqualsAndHashCode.Exclude
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @EqualsAndHashCode.Exclude
    private LocalDateTime updatedAt;

    @Version
    @EqualsAndHashCode.Exclude
    private int version;

}
