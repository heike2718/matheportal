use matheportal_sessions;

DROP INDEX idx_matheportal_sessions_expires_at 
ON matheportal_sessions;

CREATE INDEX idx_matheportal_sessions_created_at 
ON matheportal_sessions (created_at);

CREATE OR REPLACE EVENT cleanup_dead_sessions
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURRENT_DATE, '02:00:00')
DO
  DELETE FROM matheportal_sessions
  WHERE created_at < NOW(6) - INTERVAL 1440 MINUTE;