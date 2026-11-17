import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Auswertungsart, Person, Teilnahme } from '../../model/teilnahme.model';
import { Durchfuehrungsart } from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';

export const TeilnahmeActions = createActionGroup({
    source: 'MKA Teilnahme',
    events: {
        ensurePrivatteilnahmeLoaded: emptyProps(),
        privatteilnahmeLaden: emptyProps(),
        ensureSchulteilnahmeLoaded: props<{ schulkuerzel: string }>(),
        schulteilnahmeLaden: props<{ schulkuerzel: string }>(),
        teilnahmeGeladen: props<{ teilnahme: Teilnahme }>(),
        teilnahmeLadenFailed: props<{ durchfuehrungsart: Durchfuehrungsart; error: Error }>(),
        privatteilnahmeAnmelden: emptyProps(),
        schulteilnahmeAnmelden: props<{ schulkuerzel: string; auswertungsart: Auswertungsart }>(),
        teilnahmeAngemeldet: props<{ teilnahme: Teilnahme }>(),
        teilnahmeAnmeldenFailed: props<{ error: Error }>(),
        auswertungsartWaehlen: emptyProps(),
        auswertungsartGewaehlt: props<{ auswertungsart: Auswertungsart }>(),
        auswertungsartAendern: props<{ neueAuswertungsart: Auswertungsart }>(),
        ensureAnmeldendePersonGeladen: props<{ schulkuerzel: string }>(),
        anmeldendePersonLaden: props<{ schulkuerzel: string }>(),
        anmeldendePersonLadenFailed: props<{ error: Error }>(),
        anmeldendePersonGeladen: props<{ person: Person }>(),
    },
});
