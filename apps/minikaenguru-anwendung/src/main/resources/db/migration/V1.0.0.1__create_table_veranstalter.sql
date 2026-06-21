use minikaenguru;

CREATE TABLE veranstalter (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT comment 'technische ID',
	user_uuid varchar(36) NOT NULL comment 'uuid des Benutzerkontos im IAM',
    typ varchar(10) NOT NULL comment 'typ des Veranstalters - LEHRER oder PRIVAT',
    teilnahmekuerzel varchar(1000) comment 'kommaseparierte Liste der Kürzel der Schulen oder Kürzel der Privatteilnahme',
	newsletter tinyint(1) default 0 not null comment 'Flag, ob Veranstalter Newsletter bekommen möchte',
    zugang_unterlagen varchar(10) DEFAULT 'DEFAULT' NOT NULL comment 'Werte: DEFAULT, ERTEILT, ENTZOGEN',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    version int(10) DEFAULT 0 comment 'JPA-Version',
    CONSTRAINT uk_veranstalter_user_uuid UNIQUE (user_uuid)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

