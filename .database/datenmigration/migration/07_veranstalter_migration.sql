use minikaenguru;

insert into veranstalter (
    user_uuid,
    typ,
    teilnahmekuerzel,
    newsletter,
    zugang_unterlagen,
    created_at,
    updated_at
)
select
    user_uuid,
    typ,
    teilnahmekuerzel,
    newsletter,
    zugang_unterlagen,
    created_at,
    updated_at
from veranstalter_migration;
