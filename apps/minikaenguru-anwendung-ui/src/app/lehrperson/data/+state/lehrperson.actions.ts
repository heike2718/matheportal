import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Schule } from '../../../core/model/schulkatalog.model';

export const LehrpersonActions = createActionGroup({
    source: 'MKA Lehrperson',
    events: {
        wettbewerbsorganisationGestartet: props<{ schulkuerzel: string }>(),
        ensureSchulenGeladen: emptyProps(),
        schulenLaden: emptyProps(),
        schulenGeladen: props<{ schulen: Schule[] }>(),
        schulenLadenFailed: props<{ error: Error }>(),
        // wettbewerbsorganisationVerlassen: emptyProps(),
    },
});
