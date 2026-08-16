import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';

export const schulkatalogActions = createActionGroup({
    source: 'MKAdmin Schulkatalog',
    events: {
        loadLaender: emptyProps(),
        loadLaenderSucceeded: props<{ laender: Land[] }>(),
        loadLaenderFailed: props<{ error: Error }>(),
        landSelected: props<{ land: Land }>(),
        loadOrte: props<{ landId: string }>(),
        loadOrteSucceeded: props<{ orte: Ort[] }>(),
        loadOrteFailed: props<{ error: Error }>(),
        ortSelected: props<{ ort: Ort }>(),
        loadSchulen: props<{ ortId: string }>(),
        loadSchulenSucceeded: props<{ schulen: Schule[] }>(),
        loadSchulenFailed: props<{ error: Error }>(),
        schuleSelected: props<{ schule: Schule }>(),
        resetSchulkatalog: emptyProps(),
    },
});
