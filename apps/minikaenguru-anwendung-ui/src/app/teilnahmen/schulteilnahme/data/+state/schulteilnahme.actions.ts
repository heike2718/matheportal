import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Auswertungsart, Person, Teilnahme } from '../../../model/teilnahme.model';
import { Klasse, KlasseRequest } from '../../model/klasse.model';

export const SchulteilnahmeActions = createActionGroup({
    source: 'MKA Schulteilnahme',
    events: {
        ensureSchulteilnahmeGeladen: props<{ schulkuerzel: string }>(),
        schulteilnahmeLaden: props<{ schulkuerzel: string }>(),
        teilnahmeGeladen: props<{ teilnahme: Teilnahme }>(),
        teilnahmeLadenFailed: props<{ error: Error }>(),
        schulteilnahmeAnmelden: props<{ schulkuerzel: string; auswertungsart: Auswertungsart }>(),
        teilnahmeAngemeldet: props<{ teilnahme: Teilnahme }>(),
        teilnahmeAnmeldenFailed: props<{ error: Error }>(),
        auswertungsartWaehlen: emptyProps(),
        auswertungsartGewaehlt: props<{ auswertungsart: Auswertungsart }>(),
        auswertungsartAendern: props<{ neueAuswertungsart: Auswertungsart }>(),
        ensureAnmeldendePersonGeladen: props<{ schulkuerzel: string }>(),
        anmeldendePersonLaden: props<{ schulkuerzel: string }>(),
        anmeldendePersonLadenFailed: props<{ schulkuerzel: string; error: Error }>(),
        anmeldendePersonGeladen: props<{ person: Person }>(),
        ensureKlassenGeladen: props<{ schulkuerzel: string }>(),
        klassenLaden: props<{ schulkuerzel: string }>(),
        klassenGeladen: props<{ schulkuerzel: string; klassen: Klasse[] }>(),
        klassenLadenFailed: props<{ schulkuerzel: string; error: Error }>(),
        klasseAusgewaehlt: props<{ klasse: Klasse }>(),
        klasseAusRouteErmittelt: props<{ klasse: Klasse }>(),
        klasseAnlegenRequested: props<{ schulkuerzel: string }>(),
        klasseAnlegen: props<{ schulkuerzel: string; klasseRequest: KlasseRequest }>(),
        klasseAngelegt: props<{ klasse: Klasse }>(),
        klasseAnlegenFailed: props<{ schulkuerzel: string; error: Error }>(),
    },
});
