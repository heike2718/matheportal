use mk_wettbewerb;

create table schulkollegien_migration
CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci
as
select
    sk.uuid as kuerzel_schule,
    jt.user_uuid
from SCHULKOLLEGIEN sk
join json_table(
    sk.KOLLEGIUM,
    '$[*]' columns (
        user_uuid varchar(36) path '$.uuid'
    )
) as jt;

update schulkollegien_migration set kuerzel_schule = '4ZPS82NP' where kuerzel_schule = '4T8VRTAA';
update schulkollegien_migration set kuerzel_schule = '5ZFN9BUZ' where kuerzel_schule = '5SMMXW54';
update schulkollegien_migration set kuerzel_schule = 'BYZ7L0VS' where kuerzel_schule = 'BLGYG4JF';
update schulkollegien_migration set kuerzel_schule = 'KZ4UIXCU' where kuerzel_schule = 'KOF65ND3';
update schulkollegien_migration set kuerzel_schule = 'MZ4SMYPB' where kuerzel_schule = 'MXVCSK7J';
update schulkollegien_migration set kuerzel_schule = 'PYWEG7Y0' where kuerzel_schule = 'PTZ6472N';
update schulkollegien_migration set kuerzel_schule = 'RZNDANUJ' where kuerzel_schule = 'RQ7NBLEX';
update schulkollegien_migration set kuerzel_schule = 'ZZGVZYY6' where kuerzel_schule = 'ZS9FE9VH';
