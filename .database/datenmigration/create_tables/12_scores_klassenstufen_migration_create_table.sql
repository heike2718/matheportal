use mk_wettbewerb;

create table scores_klassenstufen_migration
CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci
as 
select
ID as id,
WETTBEWERB_UUID as jahr,
KLASSENSTUFE as klassenstufe,
LANDKUERZEL as kuerzel_land,
SCORE_SPASS as spass,
SCORE_ZUFRIEDENHEIT as zufriedenheit,
FREITEXT as freitext,
cast(DATE_MODIFIED as datetime(6)) as created_at
from SCORES_KLASSENSTUFEN
order by ID;

