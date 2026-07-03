use mk_kataloge;

create table orte_migration
CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci
as
select 
distinct(ORT_KUERZEL) as kuerzel,
ORT_NAME as name,
LAND_KUERZEL as kuerzel_land,
cast(current_timestamp as datetime(6)) as created_at,
cast(current_timestamp as datetime(6)) as updated_at
from SCHULEN;
