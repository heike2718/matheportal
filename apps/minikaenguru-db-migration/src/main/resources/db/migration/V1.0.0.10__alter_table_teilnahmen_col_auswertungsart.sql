use minikaenguru;

alter table teilnahmen add auswertungsart varchar(10) comment 'Auswertungsart ONLINE | OFFLINE' after teilnahmekuerzel;
