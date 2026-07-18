import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Ort, Schule } from '../../model/schulkatalog.model';

export const schulkatalogsucheActions = createActionGroup({
    source: 'Schulkatalogsuche',
    events: {
        findOrte: props<{ name: string }>(),
        findOrteSucceeded: props<{ orte: Ort[] }>(),
        findOrteFailed: emptyProps(),
        findSchulen: props<{ ort: Ort; name: string }>(),
        findSchulenSucceeded: props<{ schulen: Schule[] }>(),
        findSchulenFailed: emptyProps(),
    },
});
