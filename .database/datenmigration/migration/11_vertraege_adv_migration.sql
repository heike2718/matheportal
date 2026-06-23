use minikaenguru;

insert into vertraege_adv (
    uuid,
    vertrag_adv_text_uuid,
    kuerzel_schule,
    schulname,
    strasse,
    hausnr,
    plz,
    ort,
    laendercode,
    abgeschlossen_am,
    abgeschlossen_durch,
    created_at,
    updated_at
)
select
    uuid,
    vertrag_adv_text_uuid,
    kuerzel_schule,
    schulname,
    strasse,
    hausnr,
    plz,
    ort,
    laendercode,
    abgeschlossen_am,
    abgeschlossen_durch,
    created_at,
    updated_at
from vertraege_adv_migration;
