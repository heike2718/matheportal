import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Schule } from '../../../core/model/schulkatalog.model';

export const schulenActions = createActionGroup({
    source: 'MKA Schulen',
    events: {
        schulenLaden: emptyProps(),
        schulenGeladen: props<{ schulen: Schule[] }>(),
        schulenLadenFailed: props<{ error: Error }>(),
    },
});
