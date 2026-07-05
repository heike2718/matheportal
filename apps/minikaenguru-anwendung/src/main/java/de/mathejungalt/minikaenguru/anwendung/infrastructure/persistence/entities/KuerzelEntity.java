package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vw_kuerzel", schema = "minikaenguru")
public class KuerzelEntity {
    @Id
    @Column(name = "kuerzel", length = 10)
    private String kuerzel;

}
