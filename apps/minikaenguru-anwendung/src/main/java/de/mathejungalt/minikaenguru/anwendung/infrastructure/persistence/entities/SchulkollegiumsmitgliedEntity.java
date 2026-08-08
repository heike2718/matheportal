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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "wettbewerbsdurchfuehrende", schema = "schulkollegien")
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
public class SchulkollegiumsmitgliedEntity {

    /** Name der named query. */
    public static final String FIND_BY_SCHULKUERZEL = "SchulkollegiumsmitgliedEntity.FIND_BY_SCHULKUERZEL";

    /** Name der named query. */
    public static final String FIND_BY_UUID = "SchulkollegiumsmitgliedEntity.FIND_BY_UUID";

    /** Name der named query. */
    public static final String FIND_BY_UNIQUE_KEY = "SchulkollegiumsmitgliedEntity.FIND_BY_UNIQUE_KEY";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Exclude
    private Long id; // NOPMD id ist nun mal richtig hier.

    @Column(name = "kuerzel_schule", nullable = false, length = 8)
    private String schulkuerzel;

    @Column(name = "user_uuid", nullable = false, length = 36)
    private String userUuid;

    @Column(name = "created_at", updatable = false)
    @EqualsAndHashCode.Exclude
    private LocalDateTime createdAt;

}
