CREATE DATABASE IF NOT EXISTS minikaenguru
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'minikaenguru'@'%'
  IDENTIFIED BY 'hwinkel';

GRANT ALL PRIVILEGES
  ON minikaenguru.*
  TO 'minikaenguru'@'%';

FLUSH PRIVILEGES;
