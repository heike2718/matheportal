import { Action } from '@ngrx/store';
import { schulkatalogsucheFeature, SchulkatalogsucheState } from './schulkatalogsuche.reducer';
import { Ort } from '../../model/schulkatalog.model';

describe('schulkatalogsucheFeature tests', () => {
    const orte: Ort[] = [
        {
            kuerzel: 'ORT-1',
            name: 'erster Ort',
            land: {
                kuerzel: 'DE-BY',
                name: 'Bayern',
            },
        },
        {
            kuerzel: 'ORT-2',
            name: 'zweiter Ort',
            land: {
                kuerzel: 'DE-HE',
                name: 'Hessen',
            },
        },
    ];

    describe('sanity checks', () => {
        const unknownAction = { type: 'unknownAction' } as Action;

        it('should return the initial state, when unknown action and undefined state', () => {
            const state = schulkatalogsucheFeature.reducer(undefined, unknownAction);
            expect(state).toEqual({
                orte: [],
                selectedOrt: undefined,
                schulen: [],
                selectedSchule: undefined,
            });
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState: SchulkatalogsucheState = {
                orte,
                selectedOrt: orte[1],
                schulen: [],
                selectedSchule: undefined,
            };
            const state = schulkatalogsucheFeature.reducer(previousState, unknownAction);
            expect(state).toEqual(previousState);
        });
    });
});
