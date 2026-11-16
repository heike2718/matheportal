import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Auswertungsart, Teilnahme } from '../../model/teilnahme.model';

export const TeilnahmeActions = createActionGroup({
    source: 'MKA Teilnahme',
    events: {
        ensurePrivatteilnahmeLoaded: emptyProps(),
        privatteilnahmeLaden: emptyProps(),
        ensureSchulteilnahmeLoaded: props<{ schulkuerzel: string }>(),
        schulteilnahmeLaden: props<{ schulkuerzel: string }>(),
        teilnahmeGeladen: props<{ teilnahme: Teilnahme }>(),
        teilnahmeLadenFailed: props<{ error: Error }>(),
        privatteilnahmeAnmelden: emptyProps(),
        schulteilnahmeAnmelden: props<{ schulkuerzel: string; auswertungsart: Auswertungsart }>(),
        teilnahmeAngemeldet: props<{ teilnahme: Teilnahme }>(),
        teilnahmeAnmeldenFailed: props<{ error: Error }>(),
        auswertungsartWaehlen: emptyProps(),
        auswertungsartGewaehlt: props<{ auswertungsart: Auswertungsart }>(),
        auswertungsartAendern: props<{ neueAuswertungsart: Auswertungsart }>(),
    },
});
