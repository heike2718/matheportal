use mk_wettbewerb;

create table vertraege_adv_texte_migration as 
select
UUID as uuid,
VERSIONSNUMMER as versionsnummer,
DATEINAME as dateiname,
CHECKSUMME as checksumme,
cast(DATE_MODIFIED as datetime(6)) as created_at,
cast(DATE_MODIFIED as datetime(6)) as updated_at
from VERTRAEGE_ADV_TEXTE
order by VERSIONSNUMMER;

