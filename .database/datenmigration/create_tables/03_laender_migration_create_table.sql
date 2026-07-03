use mk_kataloge;

create table laender_migration 
CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci
as
select 
distinct(LAND_KUERZEL) as kuerzel,
LAND_NAME as name,
cast(current_timestamp as datetime(6)) as created_at,
cast(current_timestamp as datetime(6)) as updated_at
from SCHULEN;
