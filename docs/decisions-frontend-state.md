# Entscheidung: Explizites State- und Event-Modell im Frontend

## Kontext

Komplexere Frontends werden schwer wartbar, wenn Components gleichzeitig Zustand halten, HTTP-Aufrufe durchführen, Dialoge steuern, Navigation auslösen und fachliche Abläufe koordinieren.

Das eigentliche Problem ist dabei nicht die verwendete State-Management-Bibliothek, sondern ein fehlendes explizites Modell für Zustand, Ereignisse und Zustandsübergänge.

## Entscheidung

Fachlicher Zustand wird explizit modelliert.

NgRx ist die derzeit verwendete technische Umsetzung dieses Modells. Die Architektur hängt jedoch nicht von NgRx selbst ab.

Die Verantwortlichkeiten sind:

### Component

- stellt Zustand dar
- nimmt Benutzerinteraktionen entgegen
- ruft Facade-Methoden auf, um mitzuteilen, was geschehen soll
- enthält keine fachliche Ablaufsteuerung

### Action

Beschreibt ein eingetretenes Ereignis oder eine fachliche Intention.

Actions sollen ausdrücken, **was passiert ist oder passieren soll**, nicht wie es technisch umgesetzt wird.

### Reducer

- verarbeitet synchrone Zustandsübergänge
- ist frei von Seiteneffekten
- erzeugt aus altem Zustand und Action deterministisch neuen Zustand

### Effect

Orchestriert Seiteneffekte und mehrstufige Abläufe, insbesondere:

- HTTP-Aufrufe
- Dialoge
- Navigation
- Folge-Actions

Damit bleiben Components von Ablaufwissen entkoppelt.

### Selector

- liest Zustand
- kombiniert bei Bedarf mehrere Zustandsanteile
- stellt der UI eine auf ihre Bedürfnisse zugeschnittene Sicht auf den State bereit

### Facade

Eine Facade kapselt den Store-Zugriff eines Features und bietet der UI eine stabile API aus signals und fachlichen Methoden an, die actions dispatchen.

Sie ersetzt nicht Actions, Reducer, Effects oder Selectors, sondern bildet eine Feature-Grenze.

## Zustandsarten

Fachlich relevanter und zwischen Components geteilter Zustand gehört in den NgRx Store.

Reiner Darstellungszustand bleibt lokal, solange daraus keine fachliche Abhängigkeit entsteht.

## Konsequenz

Die Implementierung enthält teilweise mehr expliziten Code als eine direkte imperative Lösung.

Dieser Aufwand wird bewusst akzeptiert, weil Zustandsübergänge und Abläufe dadurch sichtbar, deterministisch testbar und voneinander getrennt werden.

Das Ziel ist nicht möglichst wenig Code, sondern möglichst wenig implizites Verhalten.
