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
 * LandReadonlyEntity. Für das Laden der Länder (Schulkatalogsuche).
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vw_laender", schema = "minikaenguru")
@NamedQueries({
        @NamedQuery(name = LandReadonlyEntity.LOAD_ALL, query = "select l from LandReadonlyEntity l order by l.name") })
public class LandReadonlyEntity {

    public static final String LOAD_ALL = "LandReadonlyEntity.LOAD_ALL";

    @Id
    @Column(name = "kuerzel")
    private String kuerzel;

    @Column(name = "name")
    private String name;

    @Column(name = "anzahl_orte")
    private int anzahlOrte;
}
