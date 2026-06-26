use minikaenguru;

insert into loesungszettel (
    jahr,
    teilnahmeart,
    teilnahmekuerzel,
    klassenstufe,
    punkte,
    kaengurusprung,
    kuerzel_land,
    sprache,
    quelle,
    nutzereingabe,
    antwortcode,
    wertungscode,
    typo,
    created_at,
    updated_at,
    kind_id
)
select 
    jahr,
    teilnahmeart,
    teilnahmekuerzel,
    klassenstufe,
    punkte,
    kaengurusprung,
    kuerzel_land,
    sprache,
    quelle,
    nutzereingabe,
    antwortcode,
    wertungscode,
    typo,
    created_at,
    updated_at,
    kind_id
from loesungszettel_migration;
