use mk_wettbewerb;

create table teilnahmen_migration as
select
WETTBEWERB_UUID as jahr,
TEILNAHMEART as teilnahmeart,
TEILNAHMENUMMER as teilnahmekuerzel,
ANGEMELDET_DURCH as angemeldet_durch,
cast(DATE_MODIFIED as datetime(6)) as created_at
from TEILNAHMEN
order by DATE_MODIFIED;

delete from teilnahmen_migration where jahr < 2010;
delete from teilnahmen_migration where jahr > 2022;
