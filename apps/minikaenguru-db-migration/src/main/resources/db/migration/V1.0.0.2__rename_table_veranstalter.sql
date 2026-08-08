use minikaenguru;

ALTER TABLE veranstalter
    DROP INDEX uk_veranstalter_user_uuid;

alter table veranstalter rename to wettbewerbsdurchfuehrende;

CREATE UNIQUE INDEX uk_wettbewerbsdurchfuehrende_user_id ON wettbewerbsdurchfuehrende(user_uuid); 
