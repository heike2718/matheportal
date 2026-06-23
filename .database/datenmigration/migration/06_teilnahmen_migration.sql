use minikaenguru;

insert into teilnahmen (
    jahr,
    teilnahmeart,
    teilnahmekuerzel,
    angemeldet_durch,
    created_at
) 
select 
    jahr,
    teilnahmeart,
    teilnahmekuerzel,
    angemeldet_durch,
    created_at
from teilnahmen_migration;
