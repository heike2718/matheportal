use minikaenguru;

insert into scores_aufgaben (
    score_klassenstufe_id,
    aufgabe_nummer,
    schwierigkeitsgrad,
    kategorie,
    verstaendlichkeit,
    lehrplan,
    created_at,
    freitext
)
select
    score_klassenstufe_id,
    aufgabe_nummer,
    schwierigkeitsgrad,
    kategorie,
    verstaendlichkeit,
    lehrplan,
    created_at,
    freitext
from scores_aufgaben_migration;
