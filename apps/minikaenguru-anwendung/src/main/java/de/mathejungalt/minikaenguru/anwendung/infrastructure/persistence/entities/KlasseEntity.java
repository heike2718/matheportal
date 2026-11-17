package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * KlasseEntity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "klassen", schema = "minikaenguru")
@NamedQueries({
        @NamedQuery(
                name = KlasseEntity.COUNT_BY_SCHULKUERZEL,
                query = "select count(k) from KlasseEntity k where k.schulkuerzel = :schulkuerzel"),
        @NamedQuery(
                name = KlasseEntity.FIND_KLASSEN_BY_SCHULKURZEL,
                query = "select k from KlasseEntity k where k.schulkuerzel = :schulkuerzel") })
@SuppressWarnings("CPD-START")
public class KlasseEntity {

    public static final String COUNT_BY_SCHULKUERZEL = "KlasseEntity.COUNT_BY_SCHULKUERZEL";

    public static final String FIND_KLASSEN_BY_SCHULKURZEL = "KlasseEntity.FIND_KLASSEN_BY_SCHULKURZEL";

    @Id
    @Column(name = "uuid", nullable = false, length = 36)
    private String uuid;

    @Column(name = "schulkuerzel", nullable = false, length = 10)
    @EqualsAndHashCode.Exclude
    private String schulkuerzel;

    @Column(name = "name", nullable = false, length = 55)
    @EqualsAndHashCode.Exclude
    private String name;

    @Column(name = "created_at", nullable = false, updatable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LocalDateTime createdAt;

    @Column(name = "created_by", nullable = true, length = 36)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String createdBy;

    @Column(name = "updated_at", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", nullable = true, length = 36)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String updatedBy;

    @Version
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private int version;
}
