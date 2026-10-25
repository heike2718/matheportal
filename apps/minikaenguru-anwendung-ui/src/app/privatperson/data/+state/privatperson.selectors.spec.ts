import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { initialPrivatpersonState, PrivatpersonState } from './privatperson.reducer';
import {
    selectTeilnahmen,
    selectWettbewerbskontext,
    selectWettbewerbskontextLoadState,
} from './privatperson.selectors';

describe('privatpersonSelectors', () => {
    const wettbewerbskontext: PrivatpersonWettbewerbskontext = {
        anmeldungMoeglich: true,
        teilnahmerefs: [
            { jahr: 2026, teilnahmenummer: '12345678' },
            { jahr: 2025, teilnahmenummer: '12345678' },
        ],
    };

    describe('selectWettbewerbskontextLoadState', () => {
        it.each(['not-loaded', 'loaded', 'unauthorized', 'technical-error', 'forbidden'] as const)(
            'should return loadState %s',
            loadState => {
                const state: PrivatpersonState = {
                    ...initialPrivatpersonState,
                    wettbewerbskontextLoadState: loadState,
                };

                const result = selectWettbewerbskontextLoadState.projector(state);

                expect(result).toBe(loadState);
            }
        );
    });

    describe('selectWettbewerbskontext', () => {
        it('should return undefined when wettbewerbskontext not loaded', () => {
            const result = selectWettbewerbskontext.projector(initialPrivatpersonState);

            expect(result).toBeUndefined();
        });

        it('should return the wettbewerbskontext when loaded', () => {
            const state: PrivatpersonState = {
                wettbewerbskontextLoadState: 'loaded',
                wettbewerbskontext,
            };

            const result = selectWettbewerbskontext.projector(state);

            expect(result).toBe(wettbewerbskontext);
        });
    });

    describe('selectTeilnahmen', () => {
        it('should return an empty array when wettbewerbskontext undefined', () => {
            const result = selectTeilnahmen.projector(undefined);

            expect(result).toEqual([]);
        });

        it('should return an empty array when no teilnahmen exist', () => {
            const kontext: PrivatpersonWettbewerbskontext = {
                ...wettbewerbskontext,
                teilnahmerefs: [],
            };

            const result = selectTeilnahmen.projector(kontext);

            expect(result).toEqual([]);
        });

        it('should return the teilnahmerefs of the wettbewerbskontext', () => {
            const result = selectTeilnahmen.projector(wettbewerbskontext);

            expect(result).toBe(wettbewerbskontext.teilnahmerefs);
        });
    });
});
