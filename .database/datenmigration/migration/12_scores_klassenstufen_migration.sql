use minikaenguru;

insert into scores_klassenstufen (
    jahr,
    klassenstufe,
    kuerzel_land,
    spass,
    zufriedenheit,
    created_at,
    freitext
)
select 
    jahr,
    klassenstufe,
    kuerzel_land,
    spass,
    zufriedenheit,
    created_at,
    freitext
from scores_klassenstufen_migration;
