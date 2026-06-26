# DB-Migrationen

## matheportal_sessions

### Flyway

- neues Migrationsscript in apps/matheportal-shell/src/main/resources/db/migration

Haben keine dedizierte Test-DB, da sessions volatil sind.

## dumps

```shell
mysqldump --databases matheportal_sessions --dump-date --add-drop-database -h 172.18.0.2 -u root -p --disable-ssl > matheportal_sessions_V5_dump.sql
```
