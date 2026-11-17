use minikaenguru;

alter table klassen change kuerzel_schule schulkuerzel varchar(36) not null comment 'Referenz auf eine Schule';
