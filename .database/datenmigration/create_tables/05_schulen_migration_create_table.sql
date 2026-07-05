use mk_kataloge;

create table schulen_migration
CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci
as
select
KUERZEL as kuerzel,
NAME as name,
ORT_KUERZEL as kuerzel_ort,
cast(current_timestamp as datetime(6)) as created_at,
cast(current_timestamp as datetime(6)) as updated_at
from SCHULEN;
