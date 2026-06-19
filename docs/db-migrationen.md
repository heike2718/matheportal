# DB-Migrationen

## Flyway

- neues Migrationsscript in .database/sql
- auf der Kommandozeile mit flyway-standalone gegen mariadb-all:

```shell
sudo /opt/flyway-5.2.4/flyway -configFile=/home/heike/git/konfigurationen/flyway/matheportal_sessions/conf/flyway.conf migrate
```

Haben keine dedizierte Test-DB, da sessions volatil sind.

## dumps

```shell
mysqldump --databases matheportal_sessions --dump-date --add-drop-database -h 172.18.0.2 -u root -p --disable-ssl > matheportal_sessions_V5_dump.sql
```
