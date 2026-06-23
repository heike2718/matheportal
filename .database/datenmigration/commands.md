# Commands für die Datenmigration

## Tabelle VERANSTALTER

Mit den selects aus create_tables Basistabelle der zu übernehmenden Spalten bauen.

Dann dumps der migrationstabellen ziehen.

```bash
mysqldump farben_wettbewerbe_migration -h 172.18.0.2 -u root -p --disable-ssl  > farben_wettbewerbe_migration.dump.sql
mysqldump mk_wettbewerb farben_wettbewerbe_migration -h 172.18.0.2 -u root -p --disable-ssl  > farben_wettbewerbe_migration.dump.sql
mysqldump mk_wettbewerb loesungszettel_migration -h 172.18.0.2 -u root -p --disable-ssl  > loesungszettel_migration.dump.sql
mysqldump mk_wettbewerb schulkollegien_migration -h 172.18.0.2 -u root -p --disable-ssl  > schulkollegien_migration.dump.sql
mysqldump mk_wettbewerb scores_aufgaben_migration -h 172.18.0.2 -u root -p --disable-ssl  > scores_aufgaben_migration.dump.sql
mysqldump mk_wettbewerb scores_klassenstufen_migration -h 172.18.0.2 -u root -p --disable-ssl  > scores_klassenstufen_migration.dump.sql
mysqldump mk_wettbewerb teilnahmen_migration -h 172.18.0.2 -u root -p --disable-ssl  > teilnahmen_migration.dump.sql
mysqldump mk_wettbewerb veranstalter_migration -h 172.18.0.2 -u root -p --disable-ssl  > veranstalter_migration.dump.sql
mysqldump mk_wettbewerb vertraege_adv_migration -h 172.18.0.2 -u root -p --disable-ssl > vertraege_adv_migration.dump.sql
mysqldump mk_wettbewerb vertraege_adv_texte_migration -h 172.18.0.2 -u root -p --disable-ssl > vertraege_adv_texte_migration.dump.sql
mysqldump mk_wettbewerb wettbewerbe_migration -h 172.18.0.2 -u root -p --disable-ssl > wettbewerbe_migration.dump.sql

mysqldump mk_kataloge laender_migration -h 172.18.0.2 -u root -p --disable-ssl > laender_migration.dump.sql
mysqldump mk_kataloge orte_migration -h 172.18.0.2 -u root -p --disable-ssl > orte_migration.dump.sql
mysqldump mk_kataloge schulen_migration -h 172.18.0.2 -u root -p --disable-ssl > schulen_migration.dump.sql
```

die dumps ins dumps-Verzeichnis des db-containers legen. Image neu bauen, dann mit source einspielen.

Daten migrieren

```sql
insert into veranstalter (user_uuid, typ, teilnahmekuerzel, newsletter, zugang_unterlagen, updated_at, created_at) select user_uuid, typ, teilnahmekuerzel, newsletter, zugang_unterlagen, updated_at, updated_at from veranstalter_migration;
```

+-----------------------------+
| Tables_in_mk_wettbewerb |
+-----------------------------+
| DOWNLOADS | nur Struktur
| EVENTS | nur Struktur
| FARBEN_WETTBEWERBE | create table
| KINDER | nur Struktur
| KLASSEN | nur Struktur
| LOESUNGSZETTEL | migration select
| MUSTERTEXTE |
| NEWSLETTERS |
| NEWSLETTER_AUSLIEFERUNGEN |
| NEWSLETTER_VERSANDAUFTRAEGE |
| PACEMAKERS | fällt weg
| SCHULEN | create table
| SCHULKOLLEGIEN | migration select
| SCORES_AUFGABEN | migration select
| SCORES_KLASSENSTUFEN | migration select
| TEILNAHMEN | migration select
| UPLOADS | nur Struktur
| USERS | fällt weg
| VERANSTALTER | migration fertig
| VERTRAEGE_ADV | migration select
| VERTRAEGE_ADV_TEXTE | migration select
| VW_DOWNLOADS |
| VW_MUSTERTEXTE_SHORTLIST |
| VW_SCORES_AUFGABEN |
| VW_UPLOADS |
| VW_WOCHENSTATISTIK |
| WETTBEWERBE | migration select
| schema_version |
| veranstalter_migration |
+-----------------------------+
