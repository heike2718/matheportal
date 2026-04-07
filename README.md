# Matheportal

Das Matheportal ist eine modulare Webanwendung zur Bereitstellung interaktiver mathematischer Inhalte wie Aufgaben, Rätsel und Übungen.

## Architektur

Das Projekt basiert auf einem Nx-Monorepo und verwendet eine Microfrontend-Architektur mit native-federation:

- **matheportal-shell-ui (Host)**: Einstiegspunkt und Navigation
- **Remotes**: Fachliche Anwendungen (z. B. Rätselbaukasten, Minikänguru)
- **BFFs**: Backend-for-Frontend-Services zur Auslieferung der jeweiligen Frontends

## Technologien

- Angular (Standalone APIs)
- Nx Workspace
- [native federation](https://blog.angular.dev/micro-frontends-with-angular-and-native-federation-7623cfc5f413)
- Quarkus (Backend)

## Entwicklung

### Voraussetzungen

- Node.js
- pnpm
- Java (für Backend)

### Installation

```bash
pnpm install
```

### starten der shell

```bash
pnpm nx serve matheportal-shell-ui
```

## build und deployment

```bash
pnpm nx build projekt
```

```bash
pnpm nx prepare-deployment projectName --configuration=qs
```

Dies führt aus:

- Bauen des Frontends mit der passenden Konfiguration
- Kopieren des Ergebnisses nach BFF/src/main/resources/META-INF/resources/projectName
- package BFF
- move quarkus-app in das Verzeichnis, auf das das Ansible-Playbook zeigt.

### Konfigurationen

- qs
- production
