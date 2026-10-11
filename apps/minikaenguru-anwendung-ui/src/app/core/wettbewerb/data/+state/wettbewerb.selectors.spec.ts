import { Wettbewerb, WETTBEWERBSSTATUS } from '../../model/wettbewerb.model';
import { WettbewerbState } from './wettbewerb.reducer';
import { fromWettbewerb } from './wettbewerb.selectors';

describe('fromWettbewerb', () => {
    const wettbewerb: Wettbewerb = {
        beginn: '01.01.2029',
        ende: '31.07.2029',
        freischaltungPrivat: '15.06.2029',
        freischaltungSchulen: '14.03.2029',
        jahr: 2029,
        status: WETTBEWERBSSTATUS.anmeldung,
    };

    describe('selectWettbewerb', () => {
        it('should return undefined when wettbewerb not loaded', () => {
            const state: WettbewerbState = {
                wettbewerbLoadState: 'not-loaded',
                wettbewerb: undefined,
            };

            const result = fromWettbewerb.selectWettbewerb.projector(state);
            expect(result).toBeUndefined();
        });

        it('should return the wettbewerb when wettbewerb loaded', () => {
            const state: WettbewerbState = {
                wettbewerbLoadState: 'loaded',
                wettbewerb,
            };

            const result = fromWettbewerb.selectWettbewerb.projector(state);
            expect(result).toEqual(wettbewerb);
        });
    });

    describe('wettbewerbLoadState', () => {
        it('should select the loadState', () => {
            const state: WettbewerbState = {
                wettbewerbLoadState: 'technical-error',
                wettbewerb: undefined,
            };

            const result = fromWettbewerb.selectWettbewerbLoadState.projector(state);
            expect(result).toBe('technical-error');
        });
    });

    describe('wettbwerbLoaded', () => {
        it.each(['not-loaded', 'unauthorized', 'technical-error'] as const)(
            'should return false when loadState %s',
            loadState => {
                const state: WettbewerbState = {
                    wettbewerbLoadState: loadState,
                    wettbewerb: undefined,
                };

                const result = fromWettbewerb.selectWettbewerbLoaded.projector(state.wettbewerbLoadState);

                expect(result).toBe(false);
            }
        );

        it('should return true when loaded', () => {
            const state: WettbewerbState = {
                wettbewerbLoadState: 'loaded',
                wettbewerb,
            };

            const result = fromWettbewerb.selectWettbewerbLoaded.projector(state.wettbewerbLoadState);

            expect(result).toBe(true);
        });
    });

    describe('selectWettbewerbRunning', () => {
        it.each([WETTBEWERBSSTATUS.anmeldung, WETTBEWERBSSTATUS.downloadSchule, WETTBEWERBSSTATUS.downloadPrivat])(
            'should return true when wettbewerb defined and status %s',
            status => {
                const state: WettbewerbState = {
                    wettbewerbLoadState: 'loaded',
                    wettbewerb: { ...wettbewerb, status },
                };

                const result = fromWettbewerb.selectWettbewerbRunning.projector(state.wettbewerb);
                expect(result).toBe(true);
            }
        );

        it.each([WETTBEWERBSSTATUS.erfasst, WETTBEWERBSSTATUS.beendet])(
            'should return false when wettbewerb defined and status %s',
            status => {
                const state: WettbewerbState = {
                    wettbewerbLoadState: 'loaded',
                    wettbewerb: { ...wettbewerb, status },
                };

                const result = fromWettbewerb.selectWettbewerbRunning.projector(state.wettbewerb);
                expect(result).toBe(false);
            }
        );

        it('should return false when wettbewerb not loaded', () => {
            const state: WettbewerbState = {
                wettbewerbLoadState: 'not-loaded',
                wettbewerb: undefined,
            };

            const result = fromWettbewerb.selectWettbewerbRunning.projector(state.wettbewerb);
            expect(result).toBe(false);
        });
    });
});
