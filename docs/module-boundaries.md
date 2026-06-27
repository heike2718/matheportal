# Module Boundaries – matheportal

Dieses Dokument beschreibt das Tag-Schema und die Boundary-Rules für `@nx/enforce-module-boundaries`.
Es dient als Referenz beim Hinzufügen neuer Libraries und beim Verstehen von Lint-Fehlern.

---

## Tag-Dimensionen

Jede Library hat **vier Tags** aus vier orthogonalen Dimensionen:

| Dimension    | Zweck                       | Beispiele                                                    |
| ------------ | --------------------------- | ------------------------------------------------------------ |
| `domain:xxx` | Fachliche Zugehörigkeit     | `domain:auth`, `domain:feedback`, `domain:shared`            |
| `type:xxx`   | Architekturschicht          | `type:api`, `type:data`, `type:model`, `type:ui`, `type:app` |
| `scope:xxx`  |                             | `scope:shared`                                               |
| `layer:xxx`  | Deployment-Rolle (nur Apps) | `layer:host`, `layer:remote`                                 |

Sonder-Tag (kein Präfix):

| Tag            | Bedeutung                                                                    |
| -------------- | ---------------------------------------------------------------------------- |
| `host-only`    | Darf nur von `layer:host` (Shell) importiert werden                          |
| `scope:shared` | Technische Querschnitts-Artefakte ohne TypeScript-Exports (z.B. SCSS-Themes) |

---

## apps libs und ihre Tags

| Library                   | domain                                  | type           | layer / sonstige |
| ------------------------- | --------------------------------------- | -------------- | ---------------- |
| auth-api                  | `domain:auth`                           | `type:api`     |                  |
| auth-data                 | `domain:auth`                           | `type:data`    |                  |
| auth-model                | `domain:auth`                           | `type:model`   |                  |
| error-and-feedback        | `domain:composition-error-and-feedback` | `type:adapter` |                  |
| error-handling-api        | `domain:error-handling`                 | `type:api`     |                  |
| feedback-api              | `domain:feedback`                       | `type:api`     |                  |
| feedback-ui               | `domain:feedback`                       | `type:ui`      | `host-only`      |
| shared-runtime-config     | `domain:shared`                         | `type:model`   |                  |
| shared-ui-themes          |                                         |                | `scope:shared`   |
| matheportal-shell-ui      | `domain:portal`                         | `type:app`     | `layer:host`     |
| minikaenguru-anwendung-ui | `domain:minikaenguru-app`               | `type:app`     | `layer:remote`   |
| raetselbaukasten          | `domain:raetselbaukasten`               | `type:app`     | `layer:remote`   |

---

## Auswertungslogik

Für jeden Zugriff `A → B` gilt:

1. Ermittle **alle Tags von A**.
2. Suche alle Rules, deren `sourceTag` auf einen Tag von A passt.
3. Für `onlyDependOnLibsWithTags`: B muss **mindestens einen** der erlaubten Tags besitzen.
4. Für `notDependOnLibsWithTags`: B darf **keinen** der verbotenen Tags besitzen.
5. **Alle** zutreffenden Rules müssen gleichzeitig erfüllt sein – eine einzige Verletzung genügt, um den Zugriff zu verbieten.

---

## Referenzmatrix

Bedeutung der Zellen:

- ✅ dieser Tag von B erfüllt die Rule
- ❌ dieser Tag von B verletzt die Rule
- `–` diese Dimension wird durch diese Rule nicht eingeschränkt

| A-Tag                     | `type:api` | `type:data` | `type:model` | `type:ui` | `domain:auth` | `domain:feedback` | `domain:error-handling` | `domain:shared` / `scope:shared` | `host-only` |
| ------------------------- | ---------- | ----------- | ------------ | --------- | ------------- | ----------------- | ----------------------- | -------------------------------- | ----------- |
| `layer:host`              | ✅         | ❌          | ✅           | ✅        | –             | –                 | –                       | ✅                               | –           |
| `layer:remote`            | –          | ❌          | –            | –         | –             | –                 | –                       | –                                | ❌          |
| `type:api`                | –          | ✅          | ✅           | ❌        | –             | –                 | ✅                      | ✅                               | –           |
| `type:data`               | ❌         | –           | ✅           | ❌        | –             | –                 | ✅                      | ✅                               | –           |
| `type:model`              | ❌         | ❌          | –            | ❌        | –             | –                 | ❌                      | ✅                               | –           |
| `type:ui`                 | ✅         | ❌          | ✅           | –         | –             | –                 | ❌                      | ✅                               | –           |
| `domain:auth`             | –          | –           | –            | –         | ✅            | ❌                | ✅                      | ✅                               | –           |
| `domain:feedback`         | –          | –           | –            | –         | ❌            | ✅                | ✅                      | ✅                               | –           |
| `domain:portal`           | –          | –           | –            | –         | ✅            | ✅                | ✅                      | ✅                               | –           |
| `domain:minikaenguru-app` | –          | –           | –            | –         | ✅            | ✅                | ✅                      | ✅                               | –           |
| `domain:raetselbaukasten` | –          | –           | –            | –         | ✅            | ✅                | ✅                      | ✅                               | –           |
| `domain:shared`           | –          | –           | –            | –         | ❌            | ❌                | ❌                      | ✅                               | –           |
| `domain:error-handling`   | –          | –           | –            | –         | ❌            | ❌                | –                       | ✅                               | –           |

---

## Beispielauswertung

### `raetselbaukasten → feedback-ui`

Tags von A (`raetselbaukasten`): `domain:raetselbaukasten`, `type:app`, `layer:remote`
Tags von B (`feedback-ui`): `domain:feedback`, `type:ui`, `host-only`

| A-Tag                     | Rule-Typ       | Bedingung                 | B erfüllt?           |
| ------------------------- | -------------- | ------------------------- | -------------------- |
| `layer:remote`            | `notDependOn`  | nicht `host-only`         | ❌ B hat `host-only` |
| `layer:remote`            | `notDependOn`  | nicht `type:data`         | ✅ B hat `type:ui`   |
| `domain:raetselbaukasten` | `onlyDependOn` | `domain:feedback` erlaubt | ✅                   |

→ Eine ❌ reicht – Zugriff **verboten**.

### `auth-api → feedback-data` (hypothetisch)

Tags von A (`auth-api`): `domain:auth`, `type:api`
Tags von B (`feedback-data`): `domain:feedback`, `type:data`

| A-Tag         | Rule-Typ       | Bedingung                                        | B erfüllt? |
| ------------- | -------------- | ------------------------------------------------ | ---------- |
| `type:api`    | `onlyDependOn` | `type:data` erlaubt                              | ✅         |
| `domain:auth` | `onlyDependOn` | `domain:feedback` **nicht** in erlaubten Domains | ❌         |

→ Obwohl die Type-Rule erfüllt ist, blockiert die Domain-Rule – Zugriff **verboten**.

---

## Neue Library hinzufügen

### Checkliste

**1. Domain bestimmen**

- Fachlich klar zuordenbar → bestehende Domain
- Genuines Querschnittsthema ohne fachlichen Bezug → `domain:shared`
- Neue fachliche Domain → neue Domain einführen (siehe unten)

**2. Type bestimmen**

| Type         | Inhalt                                                      |
| ------------ | ----------------------------------------------------------- |
| `type:api`   | Fassaden, Interceptors, Data-Provider für ngrx              |
| `type:data`  | ngrx (Actions, Reducers, Effects, Selectors), HTTP-Services |
| `type:model` | Interfaces, Types, Enums – kein ausführbarer Code           |
| `type:ui`    | Angular-Komponenten mit fachlichem Kontext                  |
| `type:app`   | Bootstrap-Code, App-Routing – so schlank wie möglich        |

**3. Sonder-Tags prüfen**

- `host-only` setzen, wenn die Library ausschließlich in der Shell (`layer:host`) eingehängt werden darf
- `layer:host` / `layer:remote` nur für `type:app`-Libraries

**4. Rule nötig?**
Neue Rules sind **nur bei neuen Domains** nötig. Neue Libraries in bestehenden Domains brauchen keine Rule-Änderung.

---

## Neue Domain hinzufügen

Beispiel: `domain:minikaenguru-admin` kommt hinzu.

### Schritt 1: Tags in `project.json` setzen

```json
{ "tags": ["domain:minikaenguru-admin", "type:app", "layer:remote"] }
```

### Schritt 2: Domain-Isolation-Rule in `eslint.config.mjs` ergänzen

```js
{
    sourceTag: 'domain:minikaenguru-admin',
    onlyDependOnLibsWithTags: [
        'domain:minikaenguru-admin',
        'domain:auth',
        'domain:feedback',
        'domain:shared',
        'domain:error-handling',
        'scope:shared',
    ],
},
```

### Schritt 3: Isolation gegenüber anderen Remote-Domains

```js
// minikaenguru-admin darf nicht auf andere Remote-Domains zugreifen
// Diese Rules existieren bereits für layer:remote – keine weitere notDependOn-Rule nötig,
// solange die onlyDependOnLibsWithTags-Rule domain:minikaenguru-app nicht enthält.
```

### Schritt 4: domain:shared aktualisieren

```js
{
    sourceTag: 'domain:shared',
    notDependOnLibsWithTags: [
        'domain:auth',
        'domain:feedback',
        'domain:error-handling',
        'domain:portal',
        'domain:minikaenguru-app',
        'domain:minikaenguru-admin', // neu
        'domain:raetselbaukasten',
    ],
},
```

### Schritt 5: Referenzmatrix ergänzen

Neue Zeile für `domain:minikaenguru-admin` mit denselben Einträgen wie `domain:minikaenguru-app`.

---

## Erlaubte Zugriffe auf einen Blick

```
layer:host (Shell)
    ├──► type:api    (auth-api, feedback-api, error-handling-api)
    ├──► type:model  (auth-model, shared-runtime-config)
    ├──► type:ui     (feedback-ui ← host-only)
    └──► scope:shared (shared-ui-themes)

layer:remote
    ├──► type:api    (auth-api, feedback-api)
    ├──► type:model  (auth-model, shared-runtime-config)
    └──► scope:shared (shared-ui-themes)
    ✗    type:data
    ✗    host-only

type:api
    ├──► type:data   (nur eigene Domain!)
    ├──► type:model  (nur eigene Domain!)
    └──► domain:error-handling

type:data
    ├──► type:model  (nur eigene Domain!)
    └──► domain:error-handling

type:model
    └──► domain:shared / scope:shared

type:ui
    └──► domain:shared / scope:shared
```
