package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities;

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
 * SchuleEntity.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vw_schulen", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = SchuleEntity.FIND_BY_ORT_ID,
        query = "select s from SchuleEntity s where s.ortId = :ortId order by s.name") })
public class SchuleEntity {

    public static final String FIND_BY_ORT_ID = "SchuleEntity.FIND_BY_ORT_ID";

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
