# Matheportal

Das Matheportal ist eine modulare Webanwendung zur Bereitstellung interaktiver mathematischer Inhalte wie Aufgaben, Rätsel und Übungen.

## Architektur

Das Projekt basiert auf einem Nx-Monorepo und verwendet eine Microfrontend-Architektur mit native-federation:

- **matheportal-bash-ui (Host)**: Einstiegspunkt und Navigation
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

### environments

Jedes backend-project hat in einem .config-Verzeichnis verschiedene ausprägungen von .env-Files für Quarkus. Diese werden mit einer passenden configuration als envFile eingebunden.

## IAM-Clients

ClientID und Client-Secret qs / prod in keypass

Für dev in .config/.env.dev

## workspace-tools

tools/workspace-tools/project.json

### Git- Targets

```bash
pnpm nx run workspace-tools:configure-git

pnpm nx run workspace-tools:show-git-config
```

### Starten der Anwendungen

```bash
pnpm nx run workspace-tools:serve-all-dev
```

oder

```bash
pnpm nx run workspace-tools:serve-all-debug
```

## Diagnostische Targets

```bash
# Welche Projekte weisen Änderungen gegenüber develop auf?
pnpm nx run workspace-tools:show-affected

# Welche Tests würde Nx aktuell wirklich ausführen? Und warum?
pnpm nx run workspace-tools:graph-affected-tests

# Wie orchestriert Nx den vollständigen Deployment-Build?
pnpm nx run workspace-tools:graph-tasks-deploy-qs
```
