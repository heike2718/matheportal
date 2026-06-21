CREATE DATABASE IF NOT EXISTS matheportal_sessions
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'matheportal_sessions'@'%'
  IDENTIFIED BY 'hwinkel';

GRANT ALL PRIVILEGES
  ON matheportal_sessions.*
  TO 'matheportal_sessions'@'%';

FLUSH PRIVILEGES;
