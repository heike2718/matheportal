# Commands für die Datenmigration

## Erzeugen der Migrationstabellen

Mit den selects aus create_tables Basistabelle der zu übernehmenden Spalten bauen.

## dumps ziehen und einspielen

Dann dumps der migrationstabellen ziehen.

```bash
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

## Daten migrieren

Daten migrieren mit den scripten im Verzeichnis migration.

## Migrationstabellen löschen

```sql
drop table farben_wettbewerbe_migration;
drop table loesungszettel_migration;
drop table schulkollegien_migration;
drop table scores_aufgaben_migration;
drop table scores_klassenstufen_migration;
drop table teilnahmen_migration;
drop table veranstalter_migration;
drop table vertraege_adv_migration;
drop table vertraege_adv_texte_migration;
drop table wettbewerbe_migration;

drop table laender_migration;
drop table orte_migration;
drop table schulen_migration;
```

| Tables_in_mk_wettbewerb     |              |
| --------------------------- | ------------ |
| DOWNLOADS                   | nur Struktur |
| EVENTS                      | nur Struktur |
| FARBEN_WETTBEWERBE          | migriert     |
| KINDER                      | nur Struktur |
| KLASSEN                     | nur Struktur |
| LOESUNGSZETTEL              | migriert     |
| MUSTERTEXTE                 |              |
| NEWSLETTERS                 |              |
| NEWSLETTER_AUSLIEFERUNGEN   |              |
| NEWSLETTER_VERSANDAUFTRAEGE |
| PACEMAKERS                  | fällt weg    |
| SCHULEN                     | migriert     |
| SCHULKOLLEGIEN              | migriert     |
| SCORES_AUFGABEN             | migriert     |
| SCORES_KLASSENSTUFEN        | migriert     |
| TEILNAHMEN                  | migriert     |
| UPLOADS                     | nur Struktur |
| USERS                       | fällt weg    |
| VERANSTALTER                | migriert     |
| VERTRAEGE_ADV               | migriert     |
| VERTRAEGE_ADV_TEXTE         | migriert     |
| WETTBEWERBE                 | migriert     |
