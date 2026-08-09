use minikaenguru;

alter table kinder add created_by varchar(36) comment 'uuid des Akteurs' after created_at;
alter table kinder add updated_by varchar(36) comment 'uuid des Akteurs' after updated_at;

alter table klassen add created_by varchar(36) comment 'uuid des Akteurs' after created_at;
alter table klassen add updated_by varchar(36) comment 'uuid des Akteurs' after updated_at;

alter table loesungszettel add created_by varchar(36) comment 'uuid des Akteurs' after created_at;
alter table loesungszettel add updated_by varchar(36) comment 'uuid des Akteurs' after updated_at;
