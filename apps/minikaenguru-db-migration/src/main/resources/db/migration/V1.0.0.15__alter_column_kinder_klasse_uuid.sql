use minikaenguru;

alter table kinder change klasse_uuid klasse_id varchar(36) not null comment 'Referenz auf klassen, falls Teilnahme über Schule';
