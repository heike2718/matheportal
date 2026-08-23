package de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * SchuleReadonlyEntity. Für das Laden von Schulen (Katalogsuche).
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vw_schulen", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = SchuleReadonlyEntity.LOAD_BY_ORT,
        query = "select s from SchuleReadonlyEntity s where s.ortId = :ortId order by s.name") })
public class SchuleReadonlyEntity {

    /** Name der named query. */
    public static final String LOAD_BY_ORT = "SchuleReadonlyEntity.LOAD_BY_ORT";

    @Id
    @Column(name = "kuerzel")
    private String kuerzel;

    @Column(name = "name")
    private String name;

    @Column(name = "kuerzel_ort")
    private String ortId;

    @Column(name = "name_ort")
    private String ort;

    @Column(name = "kuerzel_land")
    private String landId;

    @Column(name = "name_land")
    private String land;

}
