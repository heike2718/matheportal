export const portalRoutes = {
    home: 'home',

    minikaenguruAnwendung: {
        root: 'minikaenguru-anwendung',
        guests: 'guests',
        schulkatalogsuche: 'schulkatalogsuche',
        dashboardPrivatperson: 'dashboard-privatperson',
        dashboardLehrperson: 'dashboard-lehrperson',
        schuleDashboad: 'lehrperson/schule/:schulkuerzel',
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
