use minikaenguru;

alter table teilnahmen add updated_at DATETIME(6) comment 'Aktualisierungsdatum' after created_at;
