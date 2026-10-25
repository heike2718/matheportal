use minikaenguru;

update wettbewerbsdurchfuehrende set schulkuerzel = null, version = version + 1, updated_at = NOW(6) where typ = 'PRIVAT';
commit;

