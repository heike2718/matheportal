import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Schule } from '../../../core/model/schulkatalog.model';
import { SchuleWettbewerbskontext, Schulkollegium } from '../../../core/model/schule-wettbewerbskontext.model';

export const SchuleActions = createActionGroup({
    source: 'MKA Schule',
    events: {
        ensureWettbewerbskontextGeladen: props<{ schulkuerzel: string }>(),
        wettbewerbskontextLaden: props<{ schulkuerzel: string }>(),
        wettbewerbskontextGeladen: props<{ wettbewerbskontext: SchuleWettbewerbskontext }>(),
        wettbewerbskontextLadenFailed: props<{ error: Error }>(),
        schulkollegiumLaden: props<{ schule: Schule }>(),
        schulkollegiumGeladen: props<{ schulkollegium: Schulkollegium }>(),
        schulkollegiumLadenFailed: props<{ error: Error }>(),
        wettbewerbsorganisationVerlassen: emptyProps(),
    },
});
