use mk_wettbewerb;

create table wettbewerbe_migration 
CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci
as
select 
cast(UUID as int) as jahr,
STATUS as status,
BEGINN as beginn,
ENDE as ende,
FREISCHALTUNG_LEHRER as freischaltung_schulen,
FREISCHALTUNG_PRIVAT as freischaltung_privat,
IKID as loesungsbuchstaben_ikid,
EINS as loesungsbuchstaben_eins,
ZWEI as loesungsbuchstaben_zwei,
MEDIAN_IKID as median_ikid,
MEDIAN_EINS as median_eins,
MEDIAN_ZWEI as median_zwei,
cast(DATE_MODIFIED as datetime(6)) as created_at,
cast(DATE_MODIFIED as datetime(6)) as updated_at
from WETTBEWERBE
order by UUID;