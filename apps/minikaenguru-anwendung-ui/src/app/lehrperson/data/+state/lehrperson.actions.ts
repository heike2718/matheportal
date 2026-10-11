import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const LehrpersonActions = createActionGroup({
    source: 'MKA Lehrperson',
    events: {
        wettbewerbsorganisationGestartet: props<{ schulkuerzel: string }>(),
        ensureWettbewerbskontextGeladen: props<{ schulkuerzel: string }>(),
        wettbewerbsorganisationVerlassen: emptyProps(),
    },
});
