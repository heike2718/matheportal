package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "schulkollegien", schema = "minikaenguru")
@NamedQueries({
        @NamedQuery(
                name = SchulkollegiumsmitgliedEntity.FIND_BY_UUID,
                query = "select k from SchulkollegiumsmitgliedEntity k where k.userUuid = :userUuid"),
        @NamedQuery(
                name = SchulkollegiumsmitgliedEntity.FIND_BY_SCHULKUERZEL,
                query = "select k from SchulkollegiumsmitgliedEntity k where k.schulkuerzel = :schulkuerzel"),
        @NamedQuery(
                name = SchulkollegiumsmitgliedEntity.FIND_BY_UNIQUE_KEY,
                query = "select k from SchulkollegiumsmitgliedEntity k where k.userUuid = :userUuid and k.schulkuerzel = :schulkuerzel") })
@SuppressWarnings("CPD-START")
public class SchulkollegiumsmitgliedEntity {

    /** Name der named query. */
    public static final String FIND_BY_SCHULKUERZEL = "SchulkollegiumsmitgliedEntity.FIND_BY_SCHULKUERZEL";

    /** Name der named query. */
    public static final String FIND_BY_UUID = "SchulkollegiumsmitgliedEntity.FIND_BY_UUID";

    /** Name der named query. */
    public static final String FIND_BY_UNIQUE_KEY = "SchulkollegiumsmitgliedEntity.FIND_BY_UNIQUE_KEY";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // NOPMD id ist nun mal richtig hier.

    @Column(name = "kuerzel_schule", nullable = false, length = 8)
    @EqualsAndHashCode.Exclude
    private String schulkuerzel;

    @Column(name = "user_uuid", nullable = false, length = 36)
    @EqualsAndHashCode.Exclude
    private String userUuid;

    @Column(name = "created_at", updatable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LocalDateTime createdAt;

}
