# Wie testet man siwtchMap, exhaustMap etc

Hier erstmal nur switchMap und exhaustMap, weil dies die häufigsten Fälle bei http-Requests sind.

## switchMap

[findOrte$](../apps/minikaenguru-anwendung-ui/src/app/schulkatalog/schulkatalogsuche/data/+state/schulkatalogsuche.effects.spec.ts)

erste Action
→ erster Serviceaufruf
→ switchMap abonniert httpFirst$

zweite Action
→ switchMap meldet httpFirst$ ab
→ zweiter Serviceaufruf
→ switchMap abonniert httpSecond$

httpFirst$ emittiert verspätet
→ niemand hört mehr zu
→ keine Success-Action

httpSecond$ emittiert
→ Success-Action mit treffer2

## exhaustMap

[durchfuehrendenAnlegen$](../apps/minikaenguru-anwendung-ui/src/app/core/wettbewerbsdurchfuehrende/data/+state/wettbewerbsdurchfuehrende.effects.spec.ts)

erste Action
→ erster Serviceaufruf
→ exhaustMap abonniert httpFirst$
→ erster Request läuft

zweite Action
→ exhaustMap: inneres Observable läuft noch
→ zweite Action wird ignoriert
→ Service-Methode wird kein zweites Mal aufgerufen
→ httpSecond$ wird weder zurückgegeben noch abonniert

httpFirst$ emittiert responseDto1
→ Effect mappt auf die Success-Action
→ Success-Action wird emittiert

httpFirst$ completed
→ innere Subscription endet
→ exhaustMap könnte danach wieder eine neue Action annehmen
