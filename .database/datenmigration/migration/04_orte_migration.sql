use minikaenguru;

insert into orte (
    kuerzel,
    name,
    kuerzel_land,
    created_at,
    updated_at
)
select
    kuerzel,
    name,
    kuerzel_land,
    created_at,
    updated_at
from orte_migration;
