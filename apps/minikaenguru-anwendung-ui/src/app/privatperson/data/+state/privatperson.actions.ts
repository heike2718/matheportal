import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';

export const PrivatpersonActions = createActionGroup({
    source: 'MKA Privatperson',
    events: {
        wettbewerbsorganisationGestartet: emptyProps(),
        ensureWettbewerbskontextGeladen: emptyProps(),
        wettbewerbskontextLaden: emptyProps(),
        wettbewerbskontextGeladen: props<{ wettbewerbskontext: PrivatpersonWettbewerbskontext }>(),
        wettbewerbskontextLadenFailed: props<{ error: Error }>(),
    },
});
