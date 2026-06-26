use mk_wettbewerb;

create table scores_aufgaben_migration as
select
ID as id,
ID_SCORE_KLASSENSTUFE as score_klassenstufe_id,
AUFGABE_NUMMER as aufgabe_nummer,
SCORE_SCHWIERIGKEITSGRAD as schwierigkeitsgrad,
SCORE_KATEGORIE as kategorie,
SCORE_VERSTAENDLICHKEIT as verstaendlichkeit,
SCORE_LEHRPLAN as lehrplan,
FREITEXT as freitext,
cast(DATE_MODIFIED as datetime(6)) as created_at
from SCORES_AUFGABEN
order by ID;

update scores_aufgaben_migration set score_klassenstufe_id = 1 where score_klassenstufe_id = 9;
update scores_aufgaben_migration set score_klassenstufe_id = 2 where score_klassenstufe_id = 10;

