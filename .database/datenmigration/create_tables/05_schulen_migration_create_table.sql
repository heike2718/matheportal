use mk_kataloge;

create table schulen_migration as
select
KUERZEL as kuerzel,
NAME as name,
ORT_KUERZEL as kuerzel_ort,
cast(current_timestamp as datetime(6)) as created_at,
cast(current_timestamp as datetime(6)) as updated_at
from SCHULEN;
