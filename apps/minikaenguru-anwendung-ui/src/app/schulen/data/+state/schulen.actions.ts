import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Schule } from '../../../core/model/schulkatalog.model';
import { SchuleWettbewerbskontext, Schulkollegium } from '../../../core/model/schule-wettbewerbskontext.model';

export const schulenActions = createActionGroup({
    source: 'MKA Schulen',
    events: {
        schulenLaden: emptyProps(),
        schulenGeladen: props<{ schulen: Schule[] }>(),
        schulenLadenFailed: props<{ error: Error }>(),
        schuleWettbewerbskontextLaden: props<{ schule: Schule }>(),
        schuleWettbewerbskontextGeladen: props<{ schule: SchuleWettbewerbskontext }>(),
        schuleWettbewerbskontextLadenFailed: props<{ error: Error }>(),
        schulkollegiumLaden: props<{ schule: Schule }>(),
        schulkollegiumGeladen: props<{ schulkollegium: Schulkollegium }>(),
    },
});
