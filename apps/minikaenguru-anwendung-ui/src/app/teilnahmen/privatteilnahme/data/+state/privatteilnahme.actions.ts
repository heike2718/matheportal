import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Teilnahme } from '../../../model/teilnahme.model';

export const PrivatteilnahmeActions = createActionGroup({
    source: 'MKA Privatteilnahme',
    events: {
        ensurePrivatteilnahmeGeladen: emptyProps(),
        privatteilnahmeLaden: emptyProps(),
        teilnahmeGeladen: props<{ teilnahme: Teilnahme }>(),
        teilnahmeLadenFailed: props<{ error: Error }>(),
        privatteilnahmeAnmelden: emptyProps(),
        teilnahmeAngemeldet: props<{ teilnahme: Teilnahme }>(),
        teilnahmeAnmeldenFailed: props<{ error: Error }>(),
    },
});
