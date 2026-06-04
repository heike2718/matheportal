import nx from '@nx/eslint-plugin';

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
                    depConstraints: [
                        // ══════════════════════════════════════════════════════════════
                        // LAYER-RULES
                        // Steuern welche Deployment-Rolle (host/remote) was importieren darf.
                        // Wirken kumulativ mit den Type- und Domain-Rules.
                        // ══════════════════════════════════════════════════════════════

                        // Shell darf api, model, ui und shared konsumieren – aber kein type:data
                        {
                            sourceTag: 'layer:host',
                            onlyDependOnLibsWithTags: [
                                'type:api',
                                'type:adapter',
                                'type:model',
                                'type:ui',
                                'domain:shared',
                                'scope:shared',
                            ],
                        },

                        // Remotes dürfen keine host-only Libraries einbinden (z.B. feedback-ui)
                        {
                            sourceTag: 'layer:remote',
                            notDependOnLibsWithTags: ['host-only'],
                        },

                        // Remotes dürfen nicht auf type:data zugreifen
                        {
                            sourceTag: 'layer:remote',
                            notDependOnLibsWithTags: ['type:data'],
                        },

                        // ══════════════════════════════════════════════════════════════
                        // TYPE-RULES
                        // Steuern welche Schichten aufeinander zugreifen dürfen.
                        // Wirken kumulativ mit den Domain-Rules – d.h. type:api → type:data
                        // ist nur innerhalb derselben Domain erlaubt (siehe Domain-Rules).
                        // ══════════════════════════════════════════════════════════════

                        // Adapter vermeiden direkte API-zu-API-Kopplung zwischen Domains,
                        // indem sie die notwendige Verbindung in eine explizite Composition-Lib verlagern.
                        // Keine Abhängigkeiten auf UI-, Data- oder App-Libs.
                        {
                            sourceTag: 'type:adapter',
                            onlyDependOnLibsWithTags: ['type:api', 'type:model', 'domain:shared', 'scope:shared'],
                        },

                        // api-Fassaden wrappen type:data und type:model der eigenen Domain
                        {
                            sourceTag: 'type:api',
                            onlyDependOnLibsWithTags: [
                                'type:data',
                                'type:model',
                                'domain:error-handling',
                                'domain:shared',
                                'scope:shared',
                            ],
                        },

                        // adapter
                        {
                            sourceTag: 'type:adapter',
                            onlyDependOnLibsWithTags: ['type:api', 'type:model', 'domain:shared', 'scope:shared'],
                        },

                        // ngrx-Effects und http-Services: model, error-handling und shared
                        {
                            sourceTag: 'type:data',
                            onlyDependOnLibsWithTags: [
                                'type:model',
                                'domain:error-handling',
                                'domain:shared',
                                'scope:shared',
                            ],
                        },

                        // Reine Typen/Interfaces – keine fachlichen Abhängigkeiten außer shared
                        {
                            sourceTag: 'type:model',
                            onlyDependOnLibsWithTags: ['domain:shared', 'scope:shared'],
                        },

                        // UI-Komponenten dürfen nur auf shared, api und model zugreifen –
                        // kein Zugriff auf data
                        {
                            sourceTag: 'type:ui',
                            onlyDependOnLibsWithTags: ['type:api', 'type:model', 'domain:shared', 'scope:shared'],
                        },

                        // ══════════════════════════════════════════════════════════════
                        // DOMAIN-ISOLATION
                        // Steuern welche Domains aufeinander zugreifen dürfen.
                        // Kombiniert mit den Type-Rules entsteht eine zweidimensionale
                        // Schranke: auth-api darf zwar type:data importieren, aber durch
                        // die Domain-Rule nur domain:auth – also nie feedback-data.
                        // ══════════════════════════════════════════════════════════════

                        // auth ist eine geschlossene Domain
                        {
                            sourceTag: 'domain:auth',
                            onlyDependOnLibsWithTags: [
                                'domain:auth',
                                'domain:shared',
                                'domain:error-handling',
                                'scope:shared',
                            ],
                        },

                        // feedback ist eine geschlossene Domain
                        {
                            sourceTag: 'domain:feedback',
                            onlyDependOnLibsWithTags: [
                                'domain:feedback',
                                'domain:shared',
                                'domain:error-handling',
                                'scope:shared',
                            ],
                        },

                        // error-handling ist ein technisches Querschnittsthema –
                        // keine fachlichen Abhängigkeiten
                        {
                            sourceTag: 'domain:error-handling',
                            onlyDependOnLibsWithTags: ['domain:shared', 'scope:shared'],
                        },
                        // error-handling und feedback-api müssen über eine composition gekoppelt werden
                        {
                            sourceTag: 'domain:composition-error-feedback',
                            onlyDependOnLibsWithTags: [
                                'domain:error-handling',
                                'domain:feedback',
                                'domain:shared',
                                'scope:shared',
                            ],
                        },

                        // shared darf nicht auf fachliche Domains zugreifen –
                        // sonst entsteht eine versteckte Kopplung
                        {
                            sourceTag: 'domain:shared',
                            notDependOnLibsWithTags: [
                                'domain:auth',
                                'domain:feedback',
                                'domain:error-handling',
                                'domain:portal',
                                'domain:minikaenguru-app',
                                'domain:raetselbaukasten',
                            ],
                        },

                        // Shell darf auth und feedback konsumieren – aber keine Remote-Domains
                        {
                            sourceTag: 'domain:portal',
                            onlyDependOnLibsWithTags: [
                                'domain:portal',
                                'domain:auth',
                                'domain:feedback',
                                'domain:shared',
                                'domain:error-handling',
                                'domain:composition-error-feedback',
                                'scope:shared',
                            ],
                        },

                        // minikaenguru-app darf auth composition-error-feedback konsumieren –
                        // aber nicht raetselbaukasten und nicht umgekehrt
                        {
                            sourceTag: 'domain:minikaenguru-app',
                            onlyDependOnLibsWithTags: [
                                'domain:minikaenguru-app',
                                'domain:auth',
                                'domain:shared',
                                'domain:composition-error-feedback',
                                'scope:shared',
                            ],
                        },

                        {
                            sourceTag: 'domain:raetselbaukasten',
                            onlyDependOnLibsWithTags: [
                                'domain:raetselbaukasten',
                                'domain:auth',
                                'domain:shared',
                                'domain:composition-error-feedback',
                                'scope:shared',
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
        // Override or add rules here
        rules: {},
    },
];
