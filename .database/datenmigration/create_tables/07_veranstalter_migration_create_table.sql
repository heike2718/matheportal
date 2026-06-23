use mk_wettbewerb;

create table veranstalter_migration as 
select 
UUID as user_uuid,
ROLLE as typ,
TEILNAHMENUMMERN as teilnahmekuerzel,
NEWSLETTER as newsletter,
ZUGANG_UNTERLAGEN as zugang_unterlagen,
cast(DATE_MODIFIED as datetime(6)) as created_at,
cast(DATE_MODIFIED as datetime(6)) as updated_at
from VERANSTALTER
order by DATE_MODIFIED;

