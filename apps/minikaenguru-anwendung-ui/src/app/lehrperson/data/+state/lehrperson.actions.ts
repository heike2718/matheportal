import { createActionGroup, props } from '@ngrx/store';
import { Schule } from '../../../core/model/schulkatalog.model';

export const LehrpersonActions = createActionGroup({
    source: 'MKA Lehrperson',
    events: {
        schuleSelected: props<{ schule: Schule }>(),
    },
});
