import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { HttpErrorResponse } from '@angular/common/http';

export const schulkatalogsucheActions = createActionGroup({
    source: 'Schulkatalogsuche',
    events: {
        findOrte: props<{ name: string }>(),
        findOrteSucceeded: props<{ orte: Ort[] }>(),
        findOrteFailed: props<{ error: HttpErrorResponse }>(),
        ortSelected: props<{ ort: Ort }>(),
        findSchulen: props<{ ort: Ort; name: string }>(),
        findSchulenSucceeded: props<{ ortId: string; schulen: Schule[] }>(),
        findSchulenFailed: props<{ error: HttpErrorResponse }>(),
        schuleSelected: props<{ schule: Schule }>(),
        resetSuche: emptyProps(),
    },
});
