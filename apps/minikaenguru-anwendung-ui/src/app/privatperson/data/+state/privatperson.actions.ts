import { createActionGroup, props } from '@ngrx/store';

export const PrivatpersonActions = createActionGroup({
    source: 'MKA Privatperson',
    events: {
        wettbewerbsorganisationGestartet: props<{ privatkuerzel: string }>(),
        ensureWettbewerbskontextGeladen: props<{ privatkuerzel: string }>(),
    },
});
