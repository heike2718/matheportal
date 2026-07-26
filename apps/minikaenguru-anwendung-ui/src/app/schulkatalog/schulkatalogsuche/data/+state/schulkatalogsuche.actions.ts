import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Ort, Schule } from '../../model/schulkatalog.model';

export const schulkatalogsucheActions = createActionGroup({
    source: 'Schulkatalogsuche',
    events: {
        findOrte: props<{ name: string }>(),
        findOrteSucceeded: props<{ orte: Ort[] }>(),
        findOrteFailed: props<{ error: Error }>(),
        ortSelected: props<{ ort: Ort }>(),
        orteCleared: emptyProps(),
        loadSchulen: props<{ ort: Ort }>(),
        loadSchulenSucceeded: props<{ ortId: string; schulen: Schule[] }>(),
        loadSchulenFailed: props<{ error: Error }>(),
        schuleSelected: props<{ schule: Schule }>(),
        schulenCleared: emptyProps(),
        resetSuche: emptyProps(),
    },
});
