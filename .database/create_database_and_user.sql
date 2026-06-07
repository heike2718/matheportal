CREATE DATABASE IF NOT EXISTS matheportal_sessions
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- optional: eigener DB-User für den Session-Store
CREATE USER IF NOT EXISTS 'matheportal_sessions_user'@'%'
  IDENTIFIED BY 'hwinkel';

GRANT ALL PRIVILEGES
  ON matheportal_sessions.*
  TO 'matheportal_sessions_user'@'%';

FLUSH PRIVILEGES;
