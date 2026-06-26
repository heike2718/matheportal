use minikaenguru;

insert into vertraege_adv_texte (
    uuid,
    versionsnummer,
    dateiname,
    checksumme,
    created_at,
    updated_at
)
select
    uuid,
    versionsnummer,
    dateiname,
    checksumme,
    created_at,
    updated_at
from vertraege_adv_texte_migration;
