import { Ort, Schule } from '../../model/schulkatalog.model';

export interface SchulkatalogsucheState {
    readonly orte: Ort[];
    readonly selectedOrt: Ort | undefined;
    readonly schulen: Schule[];
    readonly selectedSchule: Schule | undefined;
}

export const initialSchulkatalogsucheState: SchulkatalogsucheState = {
    orte: [],
    selectedOrt: undefined,
    schulen: [],
    selectedSchule: undefined,
};
