use mk_wettbewerb;

create table farben_wettbewerbe_migration as
select
WETTBEWERB_UUID as jahr,
BACKGOUND_COLOR as background_color,
BORDER_COLOR as border_color,
POINT_BACKGOUND_COLOR as point_background_color,
POINT_BORDER_COLOR as point_border_color,
POINT_HOVER_BACKGOUND_COLOR as point_hover_background_color,
POINT_HOVER_BORDER_COLOR as point_hover_border_color
from FARBEN_WETTBEWERBE
order by WETTBEWERB_UUID;

