# shared-ui-theme: CSS- und SCSS-Architekturkonvention des Matheportals

## Ziel und Geltungsbereich

Diese Konvention gilt für die Anwendungen und UI-Libraries des Matheportals.

`libs/shared-ui-theme` definiert die gemeinsame Gestaltung. Anwendungskomponenten verwenden diese Definitionen und ergänzen ihre fachlich erforderliche Anordnung und besonderen Zustände.

Ziele sind:

- konsistente Seitenbreiten, Abstände, Typografie und Interaktionen;
- Karten mit linker Akzentkante in der jeweiligen Anwendungsfarbe;
- zentrale Definition wiederkehrender Gestaltungsentscheidungen;
- übersichtliches Component-SCSS;
- Wiederverwendung ohne unnötige Abstraktionen.

## 1. Grundbegriffe

### Token

Eine benannte Gestaltungsentscheidung, beispielsweise Abstand, Schriftgröße oder Rahmenstärke.

Tokens werden nach ihrer Bedeutung ausgewählt. Ein Icon verwendet eine Icongröße, auch wenn derselbe Zahlenwert an anderer Stelle vorkommt.

### Funktion

Eine Sass-Funktion liefert einen Wert, beispielsweise eine Markenfarbe:

```scss
color: mp-theme.mp-brand(minikaenguru);
```

### Mixin

Ein Mixin bündelt CSS-Regeln. `@include` setzt diese beim Kompilieren an der betreffenden Stelle ein:

```scss
@include mp-theme.mp-body-default;
```

Mixins reduzieren Wiederholungen im SCSS-Quellcode. Bei jeder Verwendung kann erneut CSS entstehen; sie garantieren keine kleinere CSS-Ausgabe.

### Strukturpattern

Ein Struktur-Pattern ist ein composition template für eine wiederkehrende Oberfläche. Es kombiniert vorhandene Mixins und setzt eine vereinbarte HTML- und BEM-Struktur voraus.

Es erzeugt weder HTML noch Angular-Verhalten.

## 2. Modulübersicht

Alle SCSS-Module liegen unter `src/lib/styles/`.

| Datei                  | Verantwortung                                                                           | Nicht zuständig für                                   |
| ---------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `mp-theme.scss`        | Öffentlicher Einstiegspunkt; exportiert Module mit `@forward`                           | Eigene fachliche Gestaltung                           |
| `_tokens.scss`         | Allgemeine Abstände, Radien, Schatten, neutrale Farben, Rahmen, Fokusmaße und Übergänge | Typografie, Seitenbreiten, fachliche Komponenten      |
| `_typography.scss`     | Schriftwerte, Textrollen und Material-Typografiekonfiguration                           | Farben und räumliche Anordnung                        |
| `_palettes.scss`       | Farbabstufungen und Kontrastzuordnungen für Primary, Secondary und Warn                 | Auswahl einer Anwendungsmarke                         |
| `_branding.scss`       | Anwendungsfarben und abgeleitete Hover-, Soft-, Rahmen- und Schattenfarben              | Statusmeldungen und Layout                            |
| `_functions.scss`      | Zugriff auf Theme- und Markenfarben sowie semantische Warnfarben                        | Ausgabe vollständiger Komponentenstyles               |
| `_material-theme.scss` | Zusammenbau des Material-Themes und Material-spezifische Overrides                      | Fachlicher Aufbau einer Seite                         |
| `_layout.scss`         | Seitenbreiten, Inhaltsbreiten, Breakpoints, Seitenlayout und Kartengrids                | Aussehen einzelner Formulare oder Ergebniskarten      |
| `_components.scss`     | Wiederverwendbare UI-Bausteine, Komponentenmaße und bestehende Komponentenklassen       | Fachliche Inhalte und Anwendungslogik                 |
| `_patterns.scss`       | Zusammensetzung von Suchlisten und Formulardialogen                                     | Individuelle Fachzustände und beliebige Seitenlayouts |
| `_feedback.scss`       | Farben globaler Meldungen, Lade-Backdrop und zugehörige Ebenen                          | Branding fachlicher Karten                            |

### Technische Begleitdateien

| Datei                | Zweck                                                                   |
| -------------------- | ----------------------------------------------------------------------- |
| `README.md`          | Architekturkonvention und Verwendungshinweise                           |
| `project.json`       | Nx-Projekt und vorhandene Formatierungs-/Lint-Targets                   |
| `eslint.config.mjs`  | ESLint-Konfiguration; keine vollständige Prüfung dieser SCSS-Konvention |
| `vite.config.mts`    | Vite-/Vitest-Konfiguration                                              |
| `tsconfig.json`      | TypeScript-Basiskonfiguration der Library                               |
| `tsconfig.lib.json`  | TypeScript-Konfiguration für Library-Quellen                            |
| `tsconfig.spec.json` | TypeScript-Konfiguration für Tests                                      |
| `src/index.ts`       | Derzeit leerer TypeScript-Einstiegspunkt; kein SCSS-Export              |
| `src/test-setup.ts`  | Angular-/Vitest-Testinitialisierung                                     |

Die technische Testkonfiguration ersetzt keine Sass-Kompilierung und keine visuelle Prüfung der Anwendungen.

## 3. Öffentliche Schnittstelle und Abhängigkeiten

Anwendungen importieren ausschließlich:

```scss
@use 'mp-theme' as mp-theme;
```

Die Auflösung erfolgt über den in den Anwendungen konfigurierten Sass-Include-Pfad:

```text
libs/shared-ui-theme/src/lib/styles
```

Direkte Imports interner Dateien aus Anwendungskomponenten sind zu vermeiden.

Innerhalb der Library werden direkte relative Imports mit eindeutigen Namespaces verwendet, beispielsweise:

```scss
@use './tokens' as tokens;
@use './typography' as typography;
```

Interne Module importieren nicht den Sammel-Einstiegspunkt `mp-theme.scss`. So entstehen keine Rückabhängigkeiten über die öffentliche Fassade.

Die wesentlichen Abhängigkeiten sind:

- Material-Theme: Paletten, Typografie und allgemeine Tokens.
- Farbfunktionen: Material-Theme und Branding.
- Layout: Tokens und Typografie.
- Komponentenbausteine: Tokens, Typografie, Layout, Farbfunktionen und Material-Anbindung.
- Strukturpatterns: die vorhandenen Grundlagen und Komponentenbausteine.
- Feedback: allgemeine Tokens, Farbfunktionen und Material-Farbpalette.

`@use` macht Namen im importierenden Modul verfügbar. Es exportiert sie nicht automatisch weiter. `@forward` stellt Namen den Verbrauchern des weiterleitenden Moduls bereit.

Jeder öffentliche Name hat genau eine verantwortliche Definition. Doppelte Definitionen in weitergeleiteten Modulen verursachen Sass-Namenskonflikte.

## 4. Gestaltungsgrundlagen

### Allgemeine Tokens

`_tokens.scss` enthält:

- `$mp-space-*` für `margin`, `padding` und `gap`;
- `$mp-radius-*` für Abrundungen;
- `$mp-shadow-*` für Schatten;
- `$mp-color-surface*` für neutrale Flächen;
- `$mp-color-text-*` und `$mp-color-on-brand` für Vordergründe;
- `$mp-border-*` für Rahmen;
- `$mp-focus-ring-*` für Fokusmarkierungen;
- Übergangsdauer und Timing sowie `mp-transition`.

`mp-transition` berücksichtigt reduzierte Bewegung. Die betroffenen CSS-Eigenschaften legt der Verbraucher mit `transition-property` fest.

Für eine weiße Beschriftung auf einer Markenfläche wird `$mp-color-on-brand` verwendet, nicht der zufällig ebenfalls weiße Flächen-Token.

Strukturelle Werte wie `0`, `100%`, `1fr`, `auto` oder eine fachlich benötigte Spaltenzahl dürfen lokal bleiben. Sie müssen nicht allein deshalb ausgelagert werden, weil sie Zahlen enthalten.

### Typografie

Vollständige Textstile werden bevorzugt über Rollen gewählt:

| Rolle                             | Mixin                   |
| --------------------------------- | ----------------------- |
| Seitentitel                       | `mp-page-title`         |
| Abschnitts- und Dialogtitel       | `mp-section-title`      |
| Titel normaler Karten             | `mp-card-title`         |
| Titel kompakter Karten und Listen | `mp-card-title-compact` |
| Fließtext                         | `mp-body-default`       |
| Zusatztext                        | `mp-body-small`         |
| Buttontext                        | `mp-button-text`        |
| Kleine Beschriftung               | `mp-caption`            |

Einzelne Schriftwerte dienen begründeten Ergänzungen und Sonderfällen.

Die Wahl eines Textstils ersetzt nicht die semantisch passende HTML-Überschriftenebene.

### Farben

Die Zuständigkeiten sind getrennt:

- `_palettes.scss` definiert Farbabstufungen und Kontrastfarben.
- `_branding.scss` definiert die vier Anwendungsidentitäten.
- `_functions.scss` bietet den Zugriff darauf.
- `_feedback.scss` legt die Farben globaler Statusmeldungen fest.

Unterstützte Branding-Kontexte:

- `minikaenguru`
- `raetselbaukasten`
- `minikaenguru-statistik`
- `minikaenguru-admin`

Für Anwendungsfarben stehen unter anderem diese Funktionen bereit:

- `mp-brand`
- `mp-brand-hover`
- `mp-brand-soft`
- `mp-brand-border`
- `mp-brand-border-hover`
- `mp-brand-shadow`

Unbekannte Branding-Kontexte führen zu einem Sass-Fehler.

Für Palettenzugriffe existieren `mp-primary`, `mp-accent`, `mp-warn` und die jeweiligen Kontrastfunktionen. Ihre Standardfarbstufe ist derzeit `500`. Das ist nicht automatisch dieselbe Stufe wie die konfigurierte Material-Standardfarbe.

Für die vorhandene rote Warnfläche werden die Rollenfunktionen verwendet:

- `mp-warn-background`
- `mp-warn-border`
- `mp-warn-text`

Globale Meldungen verwenden stattdessen die vollständigen Feedback-Mixins:

- `mp-feedback-info`: blau;
- `mp-feedback-warning`: orange;
- `mp-feedback-error`: rot.

Eine globale Warnmeldung und eine rote Warnung vor Datenverlust sind damit bewusst unterschiedliche Darstellungen.

## 5. Layout und responsive Regeln

### Seitencontainer

`mp-page-layout` definiert:

- volle verfügbare Breite bis zur zentralen Maximalbreite;
- horizontale Zentrierung;
- Seitenpadding;
- kleinere Abstände auf schmalen Viewports.

Das Mixin wird genau einmal auf der verantwortlichen Seitenebene verwendet, beispielsweise am App-Rahmen oder an der Portal-Startseite.

Unterseiten, Listen und Karten vergeben kein zusätzliches Seitenpadding.

### Inhaltsbreiten

Breiten werden nach ihrem Zweck gewählt:

| Token                          | Zweck                    |
| ------------------------------ | ------------------------ |
| `$mp-content-max-width`        | Regulärer Seiteninhalt   |
| `$mp-content-max-width-narrow` | Schmalerer Seiteninhalt  |
| `$mp-form-max-width`           | Formulare und Suchfelder |
| `$mp-results-max-width`        | Ergebnislisten           |
| `$mp-reading-max-width`        | Gut lesbare Textzeilen   |

Gleiche oder ähnliche Werte rechtfertigen keinen Wechsel zu einer semantisch unpassenden Familie.

### Kartengrids

`mp-card-grid($min-width)` erzeugt ein responsives Grid mit gemeinsamen Abständen. Seine Mindestbreite wird auf die verfügbare Containerbreite begrenzt.

Die Kartenbreite kommt aus `_components.scss`:

- S für kurze Auswahlkarten;
- M für normale Navigationskarten;
- L für ausführlichere Beschreibungen.

### Media- und Container-Abfragen

`@media` reagiert auf den Viewport. `@container` reagiert auf einen geeigneten übergeordneten Container.

Für wiederverwendbare Inhalte, die in unterschiedlichen Spaltenbreiten erscheinen können, ist eine Container-Abfrage häufig passend. Der Komponenten-Host kann dafür `container-type: inline-size` erhalten.

Beispiel einer eigenständigen Komponente:

```scss
@use 'mp-theme' as mp-theme;

:host {
    display: block;
    min-width: 0;
    container-type: inline-size;
}

.info-zeile {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: mp-theme.$mp-space-4;
}

@container (max-width: #{mp-theme.$mp-breakpoint-medium}) {
    .info-zeile {
        grid-template-columns: minmax(0, 1fr);
    }
}
```

Die Abfrage gestaltet hier Inhalte innerhalb des Hosts. Sie verändert nicht auf Grundlage seiner eigenen Größe den Host selbst.

Vorhandene Breakpoints verwenden; neue Grenzen nur mit einer konkreten Layoutanforderung begründen.

## 6. Komponentenbausteine

### Karten

`mp-card-surface($context)` definiert Oberfläche, Rahmen, Radius und gegebenenfalls die linke Akzentkante. Es bestimmt weder Innenpadding noch Inhaltsanordnung.

`mp-card-interaction($context)` ergänzt Hover-, Aktiv- und Fokusdarstellung. Es wird ausschließlich am tatsächlich bedienbaren Element eingebunden.

Eine statische Karte mit eigenen Buttons erhält keine Interaktionsgestaltung für die Gesamtfläche.

Eigenständiges Beispiel:

```scss
@use 'mp-theme' as mp-theme;

:host {
    display: block;
    min-width: 0;
}

.auswahl-karte {
    @include mp-theme.mp-body-default;
    @include mp-theme.mp-card-surface(raetselbaukasten);
    @include mp-theme.mp-card-interaction(raetselbaukasten);

    width: 100%;
    padding: mp-theme.$mp-space-5;
    text-align: left;
}
```

```html
<button type="button" class="auswahl-karte">Aufgabensammlung auswählen</button>
```

Umschließt ein Link eine Material-Karte, liegt die Fokusmarkierung auf dem Link. Die Karte kann ergänzend ihren Hintergrund verändern.

### Aktionen und Eingaben

- `mp-action-primary` und `mp-action-secondary` gestalten eigene Buttons oder Links mit Buttondarstellung.
- `mp-action-base` liefert ihre gemeinsame Grundlage.
- `mp-input` gestaltet eigene native Eingaben außerhalb eines Material-Form-Fields.
- `mp-focus-ring` liefert eine gemeinsame Fokusmarkierung.
- `mp-icon-size` bestimmt die Größe des Icons, nicht die Klickfläche.

Ein Button erhält seine Semantik und Bedienbarkeit durch HTML beziehungsweise Angular. CSS allein deaktiviert keinen Link und erzeugt keine Tastaturbedienung.

### Komponentenmaße

Die Größenfamilien gehören zu `_components.scss`:

- `$mp-card-min-width-*`: Mindestbreiten einzelner Karten;
- `$mp-control-min-height-*`: Mindesthöhen von Bedienelementen;
- `$mp-icon-size-*`: Iconabmessungen.

Mindesthöhen lassen Platz für mehrzeiligen Text. Sie sollen nicht durch feste Höhen ersetzt werden.

## 7. Angular Material

`_material-theme.scss` kombiniert Paletten und Typografie zum Material-Theme.

Das vollständige Theme wird in der globalen `styles.scss` einer Anwendung eingebunden:

```scss
@use 'mp-theme' as mp-theme;

@include mp-theme.mp-material-theme;
```

Dieses vollständige Theme gehört nicht in jede Komponenten-SCSS-Datei.

Für einzelne Komponenten stehen bereit:

- `mp-material-card($context)` für Material-Karten;
- `mp-material-actions($context)` für einen Container mit den unterstützten Material-Buttons und -Links.

Die darunterliegenden Material-Override-Mixins liegen in `_material-theme.scss`.

Material-Anpassungen verwenden bevorzugt die vorhandenen Override-Schnittstellen. Keine Abhängigkeit von internen MDC-Klassen oder `::ng-deep` einführen, wenn eine öffentliche Schnittstelle genügt.

Bei Angular-Style-Kapselung ist zu beachten:

- CSS-Variablen können über Eltern weitergegeben werden.
- Selektoren aus einer Elternkomponente gestalten nicht automatisch das Template einer Kindkomponente.
- Mixins mit Selektoren müssen dort eingebunden werden, wo sie die vorgesehenen Elemente tatsächlich erreichen.

## 8. Strukturpatterns als Composition Templates

Die Patterns in `_patterns.scss` kombinieren vorhandene Bausteine.

Sie übernehmen keine Suchlogik, Formularvalidierung, Dialogöffnung, Fokusfalle oder fachliche Datenverarbeitung.

### BEM-Vertrag

Ein Include innerhalb von `.ort-suche` erweitert `&__title` zu `.ort-suche__title`.

Die Elementklasse ist ein eigener Selektor. Daraus entsteht nicht automatisch ein Nachfahrenselektor wie `.ort-suche .ort-suche__title`.

Daher gelten:

- eindeutiger BEM-Blockname;
- ein Pattern-Include innerhalb dieses Blocks;
- passende Elementklassen im Template;
- HTML-Anordnung entsprechend dem Layoutvertrag.

Optionale Elemente dürfen fehlen. Die zugehörigen CSS-Regeln bleiben dann ungenutzt.

### `mp-search-list($context)`

Verantwortet:

- vertikalen Aufbau und Abstände;
- optionalen Header und Zurück-Button;
- Titel, Suchfeld, Label und Eingabe;
- Ergebnisanzahl und Ergebnisliste;
- optionale primäre Aktion;
- zentrale Formular- und Ergebnisbreiten.

Die Gestaltung einzelner Ergebniskarten und besondere Validierungszustände bleiben lokal.

```scss
@use 'mp-theme' as mp-theme;

:host {
    display: block;
    min-width: 0;
}

.ort-suche {
    @include mp-theme.mp-search-list(minikaenguru);
}
```

```html
<section class="ort-suche" aria-labelledby="ort-suche-title">
    <h2 id="ort-suche-title" class="ort-suche__title">Ort auswählen</h2>

    <div class="ort-suche__search-field">
        <label class="ort-suche__label" for="ort-name">Ortsname</label>
        <input id="ort-name" class="ort-suche__input" type="search" />
    </div>

    <p class="ort-suche__result-count">Ein Ergebnis</p>

    <ul class="ort-suche__results">
        <li class="ort-suche__result">Berlin</li>
    </ul>
</section>
```

Das Beispiel zeigt den Styling-Vertrag. Es implementiert keine Suchfunktion.

### `mp-form-dialog($context)`

Verantwortet:

- Dialoghülle und Höhenbegrenzung;
- Titel;
- schrumpfbaren Formularbereich;
- scrollenden Inhalt;
- Feldbreiten;
- Aktionsleiste und Aktionsvarianten.

Erwartete Struktur:

```text
Dialog
├── Titel
└── Formular
    ├── scrollender Inhalt
    └── Aktionsleiste
```

Die Aktionen stehen außerhalb des scrollenden Inhalts.

```scss
@use 'mp-theme' as mp-theme;

:host {
    display: block;
    min-width: 0;
}

.name-dialog {
    @include mp-theme.mp-form-dialog(minikaenguru-admin);
}
```

```html
<div class="name-dialog">
    <h2 id="name-dialog-title" class="name-dialog__title">Name bearbeiten</h2>

    <form class="name-dialog__form">
        <div class="name-dialog__content">
            <mat-form-field class="name-dialog__field">
                <mat-label>Name</mat-label>
                <input matInput name="name" />
            </mat-form-field>
        </div>

        <div class="name-dialog__actions">
            <button type="button" class="name-dialog__action name-dialog__action--secondary">Abbrechen</button>

            <button type="submit" class="name-dialog__action name-dialog__action--primary">Speichern</button>
        </div>
    </form>
</div>
```

Material-Imports, Formularlogik, Dialogbeschriftung und Fokussteuerung bleiben Aufgabe der Angular-/CDK-Integration.

`__action` allein definiert im aktuellen Pattern keinen vollständigen Buttonstil. Dafür ist zusätzlich `--primary` oder `--secondary` erforderlich.

## 9. Globale Regeln und CSS-Ausgabe

Der Einstiegspunkt ist derzeit nicht ausschließlich eine Sammlung aus Variablen und Mixins:

- `_layout.scss` enthält Regeln für `html`, `body`, Box-Sizing und `.mp-page*` beziehungsweise `.mp-section*`.
- `_components.scss` enthält bestehende `.mp-card*`-Klassen und `.mp-toolbar-spacer`.
- `_material-theme.scss` erzeugt beim Laden Material-Basisklassen.

Diese CSS-Regeln können auch beim Import des Einstiegspunkts ausgegeben werden. Sass vermeidet mehrfaches Laden innerhalb einer Modulkompilierung; getrennte Komponentenkompilierungen können dennoch CSS wiederholen.

Die vorhandene Struktur wird nicht nebenbei umgebaut. Neue Patterns und Bausteine sollen jedoch bevorzugt ausschließlich Definitionen liefern und keine zusätzlichen globalen Selektoren einführen.

Angular-Komponenten verwenden BEM-Klassen mit Mixins.

## 10. Regeln für neue Komponenten

1. **Vorhandenes prüfen.** Zuerst passende Patterns, dann Bausteine und schließlich einzelne Tokens auswählen.
2. **BEM verwenden.** Klassen gehören eindeutig zur jeweiligen Komponente.
3. **Nur passende Patterns einsetzen.** Eine abweichende Oberfläche nicht mit zahlreichen Überschreibungen in ein Pattern zwingen.
4. **Component-SCSS lokal halten.** Fachliche Anordnung und besondere Zustände bleiben in der Anwendung.
5. **Keine Gestaltungswerte kopieren.** Vorhandene Farben, Maße, Textstile und Interaktionen zentral beziehen.
6. **Semantik vor Zahlenwert.** Keine Abstandstokens als Ersatz für Icongrößen oder Fokusmaße verwenden.
7. **Padding-Verantwortung beachten.** Seitenpadding einmal pro verantwortlichem Seitencontainer.
8. **Interaktion am richtigen Element.** Fokus auf Link, Button oder Eingabe; keine irreführende Karteninteraktion.
9. **Erweiterungen nach dem Include.** Besondere Zustände über lokale BEM-Modifier ergänzen.
10. **Spezifität niedrig halten.** Keine IDs, unnötigen Selektorketten oder `!important` zur Kompensation unpassender Regeln.
11. **Komponentengrenzen respektieren.** Keine unbeabsichtigten Eingriffe in fremde Komponenten.
12. **Responsive Verhalten begründen.** Viewport- und Container-Abfragen nach dem tatsächlichen Platzbedarf wählen.
13. **Zugänglichkeit erhalten.** Sichtbarer Fokus, lesbare Texte, umbrechende Beschriftungen und reduzierte Bewegung berücksichtigen.
14. **Nur den öffentlichen Einstiegspunkt importieren.** Interne Library-Pfade bleiben innerhalb der Library.

## 11. Wann eine gemeinsame Erweiterung sinnvoll ist

Eine neue gemeinsame Definition braucht einen belegten Zweck.

- **Neuer Token:** Eine wiederkehrende Gestaltungsentscheidung fehlt in der passenden Familie.
- **Neues Baustein-Mixin:** Dieselbe zusammenhängende Gestaltung eines UI-Bestandteils wiederholt sich.
- **Neues Struktur-Pattern:** Mehrere Oberflächen teilen tatsächlich denselben Aufbau und denselben Klassenvertrag.
- **Lokale Regel:** Die Anforderung betrifft nur eine Komponente oder eine fachliche Besonderheit.

Nicht ausreichend sind:

- zwei zufällig gleiche Zahlen;
- eine einzelne umfangreiche Komponente;
- eine vermutete spätere Verwendung;
- der Wunsch, jede CSS-Deklaration hinter einem Mixin zu verstecken.

Neue Patterns erhalten möglichst wenige Parameter. Branding oder eine vorhandene Größenauswahl sind nachvollziehbare Parameter. Viele boolesche Schalter und komponentenspezifische Sonderfälle sprechen gegen die Abstraktion.

Bei jedem neuen Pattern dokumentieren:

- Verantwortung;
- erwartete Klassen und HTML-Anordnung;
- Parameter;
- vorgesehene Verbraucher;
- bewusst lokal verbleibende Anforderungen.

## 12. Änderungen und Prüfung

Änderungen an gemeinsam genutzten Mixins wirken auf alle Verbraucher. Änderungen an BEM-Suffixen oder der erwarteten DOM-Struktur sind Änderungen des Pattern-Vertrags.

Vor einer Änderung:

- Verwendungen suchen.
- Betroffene Zustände und Layouts identifizieren.
- Prüfen, ob die zuständige Ebene geändert wird.
- Keine konkurrierende Definition unter demselben öffentlichen Namen anlegen.

Bei der Verifikation berücksichtigen:

- Sass-Kompilierung der betroffenen Anwendungen;
- breite und schmale Ansichten;
- schmale Container in breiten Viewports;
- lange Titel, Ergebnisnamen und Buttontexte;
- Tastaturfokus und deaktivierte Aktionen;
- Validierungs- und Fehlermeldungen;
- Dialog-Scrolling bei geringer Höhe;
- reduzierte Bewegung.

Formatierung und Linting ersetzen diese Prüfungen nicht. Die vorhandene Vitest-Konfiguration belegt ebenfalls keine vollständige SCSS-Testabdeckung.

## 13. Verbindliche Pflege der Konvention

Die Implementierung und diese Dokumentation werden bei wesentlichen Architekturänderungen gemeinsam aktualisiert.

Vorhandene Kompatibilitätsnamen können bleiben, sollen aber auf eine zentrale Definition verweisen. Neuer Code verwendet die dokumentierte bevorzugte Schnittstelle.

Der korrekte Library-Pfad lautet:

```text
libs/shared-ui-theme
```

Die Beispiele in diesem Dokument beschreiben Styling und Struktur. Sie sind keine vollständigen Angular-Komponenten und ersetzen keine fachliche Implementierung.
