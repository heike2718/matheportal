package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsstatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * WettbewerbEntity.
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "wettbewerbe", schema = "minikaenguru")
@NamedQueries({
        @NamedQuery(name = WettbewerbEntity.LOAD_ALL, query = "select w from WettbewerbEntity w order by w.id desc") })
public class WettbewerbEntity {

    public static final String LOAD_ALL = "WettbewerbEntity.LOAD_ALL";

    @Id
    @Column(name = "jahr")
    private Integer jahr;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Wettbewerbsstatus status;

    @Column(name = "beginn")
    private LocalDate beginn;

    @Column(name = "freischaltung_schulen")
    private LocalDate freischaltungSchulen;

    @Column(name = "freischaltung_privat")
    private LocalDate freischaltungPrivat;

    @Column(name = "ende")
    private LocalDate ende;

}
