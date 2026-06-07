# auth-sessions

Library für das Verwalten von Sessions im Matheportal.

## Cleanup

zum Cleanup gibt es ein MariaDB-Event, das täglich einmal die gestorbenen Sessions wegräumt.

Hierfür muss aber der event scheduler aktiviert sein (standardmäßig ist er das nicht)

(mariadb.conf)

```ini
[mysqld]
event_scheduler=ON
```

```sql
SHOW VARIABLES LIKE 'event%';
```
