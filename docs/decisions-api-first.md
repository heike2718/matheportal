# Entscheidung: API-First mit kontrollierter Verwendung generierter Typen

## Kontext

Frontend und Backend kommunizieren über REST-Schnittstellen.

Die Schnittstellen sollen einen expliziten, gemeinsam definierten Vertrag besitzen und nicht nachträglich aus Implementierungsklassen abgeleitet werden.

Gleichzeitig soll der generierte OpenAPI-Code nicht die gesamte Anwendung durchdringen. Andernfalls würde sich der Anwendungscode stark an die Struktur und das konkrete Generatorformat der OpenAPI-Ausgabe koppeln.

## Entscheidung

REST-Schnittstellen werden API-First in OpenAPI beschrieben.

Aus der Spezifikation werden technische Typen generiert.

Die generierte `api.types.ts` wird jedoch nicht direkt in Components, State, Facades oder sonstigem fachlichen Anwendungscode verwendet.

Stattdessen werden benötigte Schema-Typen über die jeweiligen Feature-Modelle exponiert.

Beispiel:

```ts
import { components } from './generated/api.types';

export type Land = components['schemas']['Land'];
export type Ort = components['schemas']['Ort'];
export type Schule = components['schemas']['Schule'];
```

Andere Anwendungsteile importieren anschließend ausschließlich aus dem Feature-Modell:

```ts
import { Land, Ort, Schule } from './schulkatalog.model';
```

Damit bildet die `.model.ts` die Grenze zwischen generierter API und Anwendungscode.

## HTTP-Services

HTTP-Services dürfen auf technische Informationen aus der generierten API zugreifen, wenn diese unmittelbar für den Aufruf der Schnittstelle benötigt werden.

Dazu gehören beispielsweise generierte `paths`:

```ts
type Endpoint = keyof paths;
```

Diese Verwendung bleibt auf der technischen HTTP-Schicht beschränkt.

## Konsequenzen

Die OpenAPI-Spezifikation bleibt die Source of Truth für den Schnittstellenvertrag.

Gleichzeitig ist der Anwendungscode nicht direkt vom vollständigen generierten Typmodell abhängig.

Änderungen am Generator oder an der Struktur der generierten Datei wirken sich dadurch nur an wenigen definierten Stellen aus.

Die fachlichen Imports bleiben klein, verständlich und unter eigener Kontrolle.