CREATE TABLE matheportal_sessions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    session_id VARCHAR(128) NOT NULL,
    user_uuid CHAR(36) NOT NULL,
    full_name VARCHAR(201) NOT NULL,
    roles VARCHAR(100) NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_matheportal_sessions_session_id (session_id),
    KEY idx_matheportal_sessions_user_uuid (user_uuid),
    KEY idx_matheportal_sessions_expires_at (expires_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;