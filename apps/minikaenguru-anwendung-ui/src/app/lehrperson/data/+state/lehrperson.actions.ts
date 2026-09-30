import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Schule } from '../../../core/model/schulkatalog.model';

export const LehrpersonActions = createActionGroup({
    source: 'MKA Lehrperson',
    events: {
        wettbewerbsorganisationGestartet: props<{ schule: Schule }>(),
        wettbewerbsorganisationVerlassen: emptyProps(),
    },
});
