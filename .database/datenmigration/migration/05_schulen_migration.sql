use minikaenguru;

insert into schulen (
    kuerzel,
    name,
    kuerzel_ort,
    created_at,
    updated_at
)
select
    kuerzel,
    name,
    kuerzel_ort,
    created_at,
    updated_at
from schulen_migration;
