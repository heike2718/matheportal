import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { WettbewerbFacade } from './wettbewerb.facade';
import { WettbewerbActions } from '../data/+state/wettbewerb.actions';
import { fromWettbewerb } from '../data/+state/wettbewerb.selectors';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../model/wettbewerb.model';

describe('WettbewerbFacade', () => {
    let facade: WettbewerbFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WettbewerbFacade,
                provideMockStore({
                    initialState: {},
                    selectors: [
                        {
                            selector: fromWettbewerb.selectWettbewerbLoaded,
                            value: false,
                        },
                        {
                            selector: fromWettbewerb.selectWettbewerb,
                            value: undefined,
                        },
                    ],
                }),
            ],
        });

        store = TestBed.inject(MockStore);
        facade = TestBed.inject(WettbewerbFacade);

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    afterEach(() => {
        store.resetSelectors();
        vi.restoreAllMocks();
    });

    describe('observables', () => {
        it.each(['not-loaded', 'loaded', 'technical-error'] as const)(
            'should expose wettbewerbLoadState %s',
            async loadState => {
                store.overrideSelector(fromWettbewerb.selectWettbewerbLoadState, loadState);
                store.refreshState();

                const emitted = await firstValueFrom(facade.wettbewerbLoadState$);

                expect(emitted).toBe(loadState);
            }
        );
    });

    describe('signals', () => {
        it('should update the wettbewerbLoaded when selector result changes', () => {
            expect(facade.wettbewerbLoaded()).toBe(false);

            const selector = store.overrideSelector(fromWettbewerb.selectWettbewerbLoaded, true);
            store.refreshState();

            expect(facade.wettbewerbLoaded()).toBe(true);

            selector.setResult(false);
            store.refreshState();

            expect(facade.wettbewerbLoaded()).toBe(false);
        });
        it('should expose and update wettbewerb', () => {
            const wettbewerb: Wettbewerb = {
                beginn: '01.01.2026',
                ende: '31.07.2026',
                freischaltungPrivat: '15.06.2026',
                freischaltungSchulen: '14.03.2026',
                jahr: 2026,
                status: WETTBEWERBSSTATUS.anmeldung,
            };

            expect(facade.aktuellerWettbewerb()).toBeUndefined();

            store.overrideSelector(fromWettbewerb.selectWettbewerb, wettbewerb);
            store.refreshState();

            expect(facade.aktuellerWettbewerb()).toEqual({
                beginn: '01.01.2026',
                ende: '31.07.2026',
                freischaltungPrivat: '15.06.2026',
                freischaltungSchulen: '14.03.2026',
                jahr: 2026,
                status: WETTBEWERBSSTATUS.anmeldung,
            });

            const updatedWettbewerb: Wettbewerb = {
                ...wettbewerb,
                status: WETTBEWERBSSTATUS.downloadSchule,
            };

            store.overrideSelector(fromWettbewerb.selectWettbewerb, updatedWettbewerb);
            store.refreshState();

            expect(facade.aktuellerWettbewerb()?.status).toBe(WETTBEWERBSSTATUS.downloadSchule);
        });
    });

    describe('methods', () => {
        it('should dispatch the correct action on ensureWettbewerbGeladen', () => {
            facade.ensureWettbewerbGeladen();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(WettbewerbActions.ensureWettbewerbGeladen());
        });
    });
});
