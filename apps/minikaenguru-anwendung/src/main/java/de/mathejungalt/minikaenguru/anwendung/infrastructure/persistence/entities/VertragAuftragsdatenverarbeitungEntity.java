package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * VertragAuftragsdatenverarbeitungEntity.
 */
@Data
@Builder
@Entity
@Table(name = "vertraege_adv")
@NamedQueries({ @NamedQuery(name = VertragAuftragsdatenverarbeitungEntity.FIND_ID_BY_SCHULKUERZEL, query = """
        select new java.lang.String(v.uuid) from VertragAuftragsdatenverarbeitungEntity v
        where v.schulkuerzel = :schulkuerzel
        """) })
@SuppressWarnings("CPD-START")
public class VertragAuftragsdatenverarbeitungEntity {

    public static final String FIND_ID_BY_SCHULKUERZEL = "VertragAuftragsdatenverarbeitungEntity.FIND_ID_BY_SCHULKUERZEL";

    @Id
    @Column(name = "uuid", nullable = false, length = 36)
    private String uuid;

    @Column(name = "kuerzel_schule", nullable = false, length = 8)
    @EqualsAndHashCode.Exclude
    private String schulkuerzel;

    @Column(name = "schulname", nullable = false, length = 100)
    @EqualsAndHashCode.Exclude
    private String schulname;

    @Column(name = "strasse", nullable = false, length = 200)
    @EqualsAndHashCode.Exclude
    private String strasse;

    @Column(name = "hausnr", nullable = false, length = 10)
    @EqualsAndHashCode.Exclude
    private String hausnummer;

    @Column(name = "plz", nullable = false, length = 10)
    @EqualsAndHashCode.Exclude
    private String plz;

    @Column(name = "ort", nullable = false, length = 100)
    @EqualsAndHashCode.Exclude
    private String ort;

    @Column(name = "laendercode", nullable = false, length = 2)
    @EqualsAndHashCode.Exclude
    private String laendercode;

    @Column(name = "abgeschlossen_am", nullable = false, length = 19)
    @EqualsAndHashCode.Exclude
    private String abgeschlossenAm;

    @Column(name = "abgeschlossen_durch", nullable = false, length = 36)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String abgeschlossenDurch;

    @Column(name = "vertrag_adv_text_uuid", nullable = false, length = 36)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String uuidVertragstext;

    @Column(name = "created_at", nullable = false, updatable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LocalDateTime updatedAt;

    @Version
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private int version;

}
