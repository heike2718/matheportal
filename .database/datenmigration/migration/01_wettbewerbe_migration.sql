use minikaenguru;

insert into wettbewerbe (
    jahr,
    status,
    beginn,
    ende,
    freischaltung_schulen,
    freischaltung_privat,
    loesungsbuchstaben_ikid,
    loesungsbuchstaben_eins,
    loesungsbuchstaben_zwei,
    median_ikid,
    median_eins,
    median_zwei,
    created_at,
    updated_at
) 
select
    jahr,
    status,
    beginn,
    ende,
    freischaltung_schulen,
    freischaltung_privat,
    loesungsbuchstaben_ikid,
    loesungsbuchstaben_eins,
    loesungsbuchstaben_zwei,
    median_ikid,
    median_eins,
    median_zwei,
    created_at,
    updated_at
from wettbewerbe_migration;
