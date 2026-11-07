use minikaenguru;

update kinder set sprache = 'DE', version = version + 1, updated_at = updated_at where sprache = 'de';
update kinder set sprache = 'EN', version = version + 1, updated_at = updated_at where sprache = 'en';

update loesungszettel set sprache = 'DE', version = version + 1, updated_at = updated_at where sprache = 'de';
update loesungszettel set sprache = 'EN', version = version + 1, updated_at = updated_at where sprache = 'en';
commit;

