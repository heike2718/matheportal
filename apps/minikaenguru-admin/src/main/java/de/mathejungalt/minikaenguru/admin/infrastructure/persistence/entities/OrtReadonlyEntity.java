package de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * OrtReadonlyEntity. Für das Laden von Orten (Katalogsuche).
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "vw_orte", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = OrtReadonlyEntity.LOAD_BY_LAND,
        query = "select o from OrtReadonlyEntity o where o.kuerzelLand = :kuerzelLand order by o.name") })
public class OrtReadonlyEntity {

    public static final String LOAD_BY_LAND = "OrtReadonlyEntity.LOAD_BY_LAND";

    @Id
    @Column(name = "kuerzel")
    private String kuerzel;

    @Column(name = "name")
    @EqualsAndHashCode.Exclude
    private String name;

    @Column(name = "kuerzel_land")
    @EqualsAndHashCode.Exclude
    private String kuerzelLand;

    @Column(name = "name_land")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private String nameLand;

    @Column(name = "anzahl_schulen")
    @EqualsAndHashCode.Exclude
    private int anzahlSchulen;

}
