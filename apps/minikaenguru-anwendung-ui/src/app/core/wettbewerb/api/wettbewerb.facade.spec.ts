import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { WettbewerbFacade } from './wettbewerb.facade';
import { WettbewerbActions } from '../data/+state/wettbewerb.actions';
import { fromWettbewerb } from '../data/+state/wettbewerb.selectors';

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
                            selector: fromWettbewerb.selectWettbewerbLoadState,
                            value: 'not-loaded',
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
        it.each(['not-loaded', 'loaded', 'technical-error', 'unauthorized'] as const)(
            'should expose wettbewerbLoadState %s',
            async loadState => {
                store.overrideSelector(fromWettbewerb.selectWettbewerbLoadState, loadState);
                store.refreshState();

                const emitted = await firstValueFrom(facade.wettbewerbLoadState$);

                expect(emitted).toBe(loadState);
            }
        );
    });

    describe('methods', () => {
        it('should dispatch the correct action on ensureWettbewerbGeladen', () => {
            facade.ensureWettbewerbGeladen();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(WettbewerbActions.ensureWettbewerbGeladen());
        });
    });
});
