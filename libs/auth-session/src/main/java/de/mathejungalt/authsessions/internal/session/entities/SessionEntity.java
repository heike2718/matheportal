package de.mathejungalt.authsessions.internal.session.entities;

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
import lombok.NoArgsConstructor;

/**
 * SessionEntity
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "matheportal_sessions", schema = "matheportal_sessions")
@NamedQueries({ @NamedQuery(
        name = SessionEntity.FIND_BY_SESSION_ID,
        query = "select s from SessionEntity where s.sessionId = :sessionId") })
public class SessionEntity {

    public static final String FIND_BY_SESSION_ID = "SessionEntity.findBySessionId";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "session_id", nullable = false, length = 128, unique = true)
    private String sessionId;

    @Column(name = "user_uuid", nullable = false, columnDefinition = "char(36)")
    private String userUuid;

    @Column(name = "full_name", nullable = false, length = 201)
    private String fullName;

    @Column(name = "roles", nullable = false, length = 100)
    private String roles;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

}
