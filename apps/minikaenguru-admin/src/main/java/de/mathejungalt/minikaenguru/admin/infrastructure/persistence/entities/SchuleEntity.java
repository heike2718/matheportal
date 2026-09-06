package de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * SchuleEntity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
@Table(name = "schulen", schema = "minikaenguru")
public class SchuleEntity {

    @Id
    @Column(name = "kuerzel", nullable = false, length = 10)
    private String kuerzel;

    @Column(name = "kuerzel_ort", nullable = false, length = 10)
    @EqualsAndHashCode.Exclude
    private String kuerzelOrt;

    @Column(name = "name", nullable = false, length = 100)
    @EqualsAndHashCode.Exclude
    private String name;

    @Column(name = "created_at", nullable = false, updatable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LocalDateTime updatedAt;

    @Version
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private int version;

}
