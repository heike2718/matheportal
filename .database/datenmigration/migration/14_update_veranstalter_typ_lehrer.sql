use minikaenguru;

update veranstalter set typ = 'SCHULE', updated_at = updated_at where typ = 'LEHRER';
