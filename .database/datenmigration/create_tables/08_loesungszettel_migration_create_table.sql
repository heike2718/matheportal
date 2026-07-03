use mk_wettbewerb;

create table loesungszettel_migration
CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci
as
select
WETTBEWERB_UUID as jahr,
TEILNAHMEART as teilnahmeart,
TEILNAHMENUMMER as teilnahmekuerzel,
KLASSENSTUFE as klassenstufe,
PUNKTE as punkte,
KAENGURUSPRUNG as kaengurusprung,
LANDKUERZEL as kuerzel_land,
SPRACHE as sprache,
QUELLE as quelle,
NUTZEREINGABE as nutzereingabe,
ANTWORTCODE as antwortcode,
WERTUNGSCODE as wertungscode,
TYPO as typo,
cast(DATE_MODIFIED as datetime(6)) as created_at,
cast(DATE_MODIFIED as datetime(6)) as updated_at,
KIND_ID as kind_id,
VERSION as version
from LOESUNGSZETTEL
order by SORTNR;

update loesungszettel_migration set teilnahmekuerzel = '7FIK4M5D', kuerzel_land = 'DE-NW' where kuerzel_land = 'ABCDE';
delete from loesungszettel_migration where jahr < 2010;

