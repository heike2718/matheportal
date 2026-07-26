use minikaenguru;

create or replace view vw_laender
as
select laender.kuerzel,
       laender.name,
       count(orte.kuerzel_land) as anzahl_orte
  from laender, orte
 where laender.kuerzel = orte.kuerzel_land
 group by orte.kuerzel_land;

create or replace view vw_orte
as
select laender.kuerzel as kuerzel_land,
       laender.name as name_land,
       orte.kuerzel,
       orte.name,
       count(schulen.kuerzel_ort) as anzahl_schulen
  from laender, orte, schulen 
 where laender.kuerzel = orte.kuerzel_land 
   and orte.kuerzel = schulen.kuerzel_ort 
 group by schulen.kuerzel_ort;

create or replace view vw_schulen
as
select 
   laender.kuerzel as kuerzel_land,
   laender.name as name_land,
   orte.kuerzel as kuerzel_ort,
   orte.name as name_ort,
   schulen.kuerzel,
   schulen.name
  from laender,
       orte,
       schulen
 where orte.kuerzel_land = laender.kuerzel
   and schulen.kuerzel_ort = orte.kuerzel;
