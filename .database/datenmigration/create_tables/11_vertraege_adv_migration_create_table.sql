use mk_wettbewerb;

create table vertraege_adv_migration
CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci
as
select
UUID as uuid,
VERTRAG_ADV_TEXT_UUID as vertrag_adv_text_uuid,
SCHULKUERZEL as kuerzel_schule,
SCHULNAME as schulname,
STRASSE as strasse,
HAUSNR as hausnr,
PLZ as plz,
ORT as ort,
LAENDERCODE as laendercode,
ABGESCHLOSSEN_AM as abgeschlossen_am,
ABGESCHLOSSEN_DURCH as abgeschlossen_durch,
cast(DATE_MODIFIED as datetime(6)) as created_at,
cast(DATE_MODIFIED as datetime(6)) as updated_at
from VERTRAEGE_ADV
order by DATE_MODIFIED;
