use minikaenguru;

create view vw_kuerzel as
(select kuerzel from schulen)
union all
(select kuerzel from orte)
union all
(select distinct(teilnahmekuerzel) from teilnahmen where length(teilnahmekuerzel) = 10);
