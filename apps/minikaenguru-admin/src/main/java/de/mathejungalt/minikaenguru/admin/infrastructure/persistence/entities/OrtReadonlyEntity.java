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
 * OrtReadonlyEntity. Für das Laden von Orten (Katalogsuche).
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vw_orte", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = OrtReadonlyEntity.LOAD_BY_LAND,
        query = "select o from OrtReadonlyEntity o where o.landId = :landId order by o.name") })
public class OrtReadonlyEntity {

    public static final String LOAD_BY_LAND = "OrtReadonlyEntity.LOAD_BY_LAND";

    @Id
    @Column(name = "kuerzel")
    private String kuerzel;

    @Column(name = "name")
    private String name;

    @Column(name = "kuerzel_land")
    private String landId;

    @Column(name = "name_land")
    private String land;

    @Column(name = "anzahl_schulen")
    private int anzahlSchulen;

}
