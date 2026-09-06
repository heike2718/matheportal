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
 * SchuleReadonlyEntity. Für das Laden von Schulen (Katalogsuche).
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "vw_schulen", schema = "minikaenguru")
@NamedQueries({ @NamedQuery(
        name = SchuleReadonlyEntity.LOAD_BY_ORT,
        query = "select s from SchuleReadonlyEntity s where s.kuerzelOrt = :kuerzelOrt order by s.name") })
public class SchuleReadonlyEntity {

    /** Name der named query. */
    public static final String LOAD_BY_ORT = "SchuleReadonlyEntity.LOAD_BY_ORT";

    @Id
    @Column(name = "kuerzel")
    private String kuerzel;

    @Column(name = "name")
    @EqualsAndHashCode.Exclude
    private String name;

    @Column(name = "kuerzel_ort")
    @EqualsAndHashCode.Exclude
    private String kuerzelOrt;

    @Column(name = "name_ort")
    @EqualsAndHashCode.Exclude
    private String nameOrt;

    @Column(name = "kuerzel_land")
    @EqualsAndHashCode.Exclude
    private String kuerzelLand;

    @Column(name = "name_land")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String nameLand;

}
