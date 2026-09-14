# Architektur

Das Matheportal ist ein Nx-Monorepo mit Angular-Frontends und Quarkus-Backends.

## Frontend

Die Angular-Anwendungen verwenden Standalone Components und NgRx für fachlichen Zustand.

Die Verantwortlichkeiten sind klar getrennt:

- **Components** stellen Zustand dar und erzeugen Benutzerinteraktionen. Sie enthalten möglichst wenig Ablauf- und Fachlogik.
- **Actions** beschreiben Ereignisse und fachliche Intentionen.
- **Reducer** führen ausschließlich synchrone Zustandsübergänge aus.
- **Effects** orchestrieren Seiteneffekte und Abläufe, insbesondere HTTP-Aufrufe, Dialoge und Navigation.
- **Selectors** lesen und kombinieren Zustand.
- **Facades** kapseln den Zugriff einer Feature-UI auf den Store, sofern dies die Feature-Grenzen vereinfacht.
- **HTTP-Services** kapseln ausschließlich die Kommunikation mit Backend-Schnittstellen.
- **Component-lokaler Zustand** bleibt in der Component bzw. wird bei Bedarf lokal verwaltet. Fachlicher Zustand gehört in den NgRx Store.

Der fachliche Datenfluss folgt grundsätzlich:

Component → Action → Reducer / Effect → Action → Reducer → Selector → Component

Components sollen keine Kenntnisse über fachliche Ablaufketten besitzen.

## Backend

Die Backends basieren auf Quarkus.

REST-Schnittstellen bilden die technische Grenze zwischen Frontend und Backend. Fachlogik wird nicht in REST-Ressourcen implementiert, sondern in dafür vorgesehenen Domain- bzw. Service-Komponenten.

## Microfrontends

Das Matheportal verwendet Native Federation.

Die Shell stellt übergreifende Portal-Funktionalität und Navigation bereit. Fachliche Remotes bleiben möglichst unabhängig von der Shell und greifen nicht direkt auf deren internen Zustand zu.

## API-Verträge

Schnittstellen werden API-First über OpenAPI beschrieben.

Aus der OpenAPI-Spezifikation generierter Code bildet die technische Schnittstelle ab. Generierte Typen werden nicht unkontrolliert durch den Anwendungscode propagiert, sondern an definierten Grenzen eingebunden.

Details dazu stehen in `decisions/api-first.md`.