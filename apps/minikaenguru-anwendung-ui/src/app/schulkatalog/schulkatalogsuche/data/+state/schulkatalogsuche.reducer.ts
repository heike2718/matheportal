import { createFeature, createReducer, on } from '@ngrx/store';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { schulkatalogsucheActions } from './schulkatalogsuche.actions';
import { userLoggedOut } from '@matheportal/auth-api';

const SCHULKATALOGSUCHE_FEATURE_KEY = 'Schulkatalogsuche';

export interface SchulkatalogsucheState {
    readonly orte: Ort[];
    readonly selectedOrt: Ort | undefined;
    readonly schulen: Schule[];
    readonly selectedSchule: Schule | undefined;
}

const initialSchulkatalogsucheState: SchulkatalogsucheState = {
    orte: [],
    selectedOrt: undefined,
    schulen: [],
    selectedSchule: undefined,
};

export const schulkatalogsucheFeature = createFeature({
    name: SCHULKATALOGSUCHE_FEATURE_KEY,
    reducer: createReducer<SchulkatalogsucheState>(
        initialSchulkatalogsucheState,
        on(schulkatalogsucheActions.findOrteSucceeded, () => initialSchulkatalogsucheState),
        on(schulkatalogsucheActions.findSchulenSucceeded, () => initialSchulkatalogsucheState),
        on(schulkatalogsucheActions.resetSuche, () => initialSchulkatalogsucheState),
        on(userLoggedOut, () => initialSchulkatalogsucheState)
    ),
});
