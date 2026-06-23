use minikaenguru;

insert into farben_wettbewerbe (
    jahr,
    background_color,
    border_color,
    point_background_color,
    point_border_color,
    point_hover_background_color,
    point_hover_border_color
)
select 
    jahr,
    background_color,
    border_color,
    point_background_color,
    point_border_color,
    point_hover_background_color,
    point_hover_border_color
from farben_wettbewerbe_migration;
