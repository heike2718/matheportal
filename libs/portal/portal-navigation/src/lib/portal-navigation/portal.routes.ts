export const portalRoutes = {
    home: 'home',

    minikaenguruAnwendung: {
        root: 'minikaenguru-anwendung',
        guests: 'guests',
        durchfuehrungsart: 'durchfuehrungsart',
        schulkatalogsuche: 'schulkatalogsuche',
        privatperson: 'privatperson',
        lehrperson: 'lehrperson',
        schule: 'schule/:schulkuerzel',
        ladefehler: 'ladefehler',
        unknown: '**',
    },

    raetselbaukasten: {
        root: 'raetselbaukasten',
        unknown: '**',
    },

    minikaenguruStatistik: {
        root: 'minikaenguru-statistik',
        unknown: '**',
    },

    minikaenguruAdmin: {
        root: 'minikaenguru-admin',
        schulkatalog: 'schulkatalog',
        unknown: '**',
    },
} as const;
