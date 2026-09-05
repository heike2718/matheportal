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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "orte", schema = "minikaenguru")
public class OrtEntity {

    @Id
    @Column(name = "kuerzel", nullable = false, length = 10)
    private String kuerzel;

    @Column(name = "kuerzel_land", nullable = false, length = 10)
    private String kuerzelLand;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "created_at", nullable = false, updatable = false)
    @EqualsAndHashCode.Exclude
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @EqualsAndHashCode.Exclude
    private LocalDateTime updatedAt;

    @Version
    @EqualsAndHashCode.Exclude
    private int version;

}
