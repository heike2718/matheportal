import { initFederation } from '@angular-architects/native-federation';

// Wir tauschen das Objekt gegen den Pfad zur Datei in 'public' aus
initFederation('/federation.manifest.json')
    .catch(err => console.error(err))
    .then(_ => import('./bootstrap'))
    .catch(err => console.error(err));
