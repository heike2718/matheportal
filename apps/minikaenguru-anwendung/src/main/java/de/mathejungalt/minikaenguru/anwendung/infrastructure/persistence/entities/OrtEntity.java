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
 * OrtEntity.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vw_orte", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = OrtEntity.FIND_BY_NAME,
        query = "select o from OrtEntity o where o.name like :name order by o.name") })
public class OrtEntity {

    public static final String FIND_BY_NAME = "OrtEntity.FIND_BY_NAME";

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
