use minikaenguru;

update wettbewerbsdurchfuehrende set zugang_unterlagen = 'STANDARD', updated_at = updated_at where zugang_unterlagen = 'DEFAULT';
