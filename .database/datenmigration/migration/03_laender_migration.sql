use minikaenguru;

insert into laender (
    kuerzel,
    name,
    created_at,
    updated_at
)
select 
    kuerzel,
    name,
    created_at,
    updated_at
from laender_migration;
