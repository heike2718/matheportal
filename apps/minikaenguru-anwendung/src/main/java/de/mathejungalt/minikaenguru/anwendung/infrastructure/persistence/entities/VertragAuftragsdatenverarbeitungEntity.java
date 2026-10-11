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
public class VertragAuftragsdatenverarbeitungEntity {

    public static final String FIND_ID_BY_SCHULKUERZEL = "VertragAuftragsdatenverarbeitungEntity.FIND_ID_BY_SCHULKUERZEL";

    @Id
    @Column(name = "uuid", nullable = false, length = 36)
    private String uuid;

    @Column(name = "kuerzel_schule", nullable = false, length = 8)
    private String schulkuerzel;

    @Column(name = "schulname", nullable = false, length = 100)
    private String schulname;

    @Column(name = "strasse", nullable = false, length = 200)
    private String strasse;

    @Column(name = "hausnr", nullable = false, length = 10)
    private String hausnummer;

    @Column(name = "plz", nullable = false, length = 10)
    private String plz;

    @Column(name = "ort", nullable = false, length = 100)
    private String ort;

    @Column(name = "laendercode", nullable = false, length = 2)
    private String laendercode;

    @Column(name = "abgeschlossen_am", nullable = false, length = 19)
    private String abgeschlossenAm;

    @Column(name = "abgeschlossen_durch", nullable = false, length = 36)
    private String abgeschlossenDurch;

    @Column(name = "vertrag_adv_text_uuid", nullable = false, length = 36)
    private String uuidVertragstext;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private int version;

}
