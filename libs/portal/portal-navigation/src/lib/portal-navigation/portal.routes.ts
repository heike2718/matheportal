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
        guests: 'guests',
        dashboard: 'dashboard',
        raetsel: 'raetsel',
        aufgabensammlungen: 'aufgabensammlungen',
        medien: 'medien',
        ladefehler: 'ladefehler',
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
