use minikaenguru;

insert into schulkollegien (
    kuerzel_schule,
    user_uuid
)
select
    kuerzel_schule,
    user_uuid
from schulkollegien_migration;
