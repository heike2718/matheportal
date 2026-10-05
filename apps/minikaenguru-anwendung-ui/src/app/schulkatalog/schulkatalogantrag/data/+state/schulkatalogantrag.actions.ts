import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Schulkatalogantrag } from '../../model/schulkatalogantrag.model';

export const SchulkatalogantragActions = createActionGroup({
    source: 'MKA Schulkatalogantrag',
    events: {
        submitSchulkatalogantrag: props<{ antrag: Schulkatalogantrag }>(),
        submitSchulkatalogantragSucceeded: emptyProps(),
        submitSchulkatalogantragFailed: props<{ error: Error }>(),
    },
});
