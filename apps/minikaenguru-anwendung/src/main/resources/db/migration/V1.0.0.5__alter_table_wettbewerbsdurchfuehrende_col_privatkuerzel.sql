use minikaenguru;

alter table wettbewerbsdurchfuehrende add privatkuerzel varchar(10) comment 'Kürzel für Privatteilnahmen' after teilnahmekuerzel;

update wettbewerbsdurchfuehrende set privatkuerzel = teilnahmekuerzel, updated_at = updated_at where typ = 'PRIVAT';

alter table wettbewerbsdurchfuehrende add constraint uk_wettbewerbsdurchfuehrende_privatkuerzel unique(privatkuerzel);

alter table wettbewerbsdurchfuehrende change column teilnahmekuerzel schulkuerzel varchar(1000) comment 'kommaseparierte Liste von Schulkürzeln';

create or replace view vw_kuerzel as
(select kuerzel from schulen)
union
(select kuerzel from orte)
union
(select privatkuerzel from wettbewerbsdurchfuehrende);
