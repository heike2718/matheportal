use minikaenguru;

drop table if exists events;

CREATE TABLE audit_events (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
    event_type varchar(100) NOT NULL comment 'Name eines events - enum',
	user_uuid varchar(36) NOT NULL comment 'uuid des Benutzerkontos im IAM',
    created_at DATETIME(6) NOT NULL,
    context varchar(1000) comment 'Kontext zu dem audit event'
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

