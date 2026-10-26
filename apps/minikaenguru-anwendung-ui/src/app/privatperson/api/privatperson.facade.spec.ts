import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PrivatpersonFacade } from './privatperson.facade';
import { TestBed } from '@angular/core/testing';
import { fromWettbewerb } from '../../core/wettbewerb/data/+state/wettbewerb.selectors';
import { PrivatpersonWettbewerbskontext } from '../model/privatperson.model';
import {
    selectWettbewerbskontext,
    selectWettbewerbskontextLoaded,
    selectWettbewerbskontextLoadState,
} from '../data/+state/privatperson.selectors';
import { firstValueFrom } from 'rxjs';
import { MinikaenguruEinstiegActions } from '../../core/ablaufsteuerung/minikaenguru-einstieg.actions';
import { DURCHFUEHRUNGSART } from '../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';

describe('PrivatpersonFacade', () => {
    const wettbewerbskontext: PrivatpersonWettbewerbskontext = {
        anmeldungMoeglich: true,
        teilnahmerefs: [],
    };

    let facade: PrivatpersonFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PrivatpersonFacade,
                provideMockStore({
                    initialState: {},
                    selectors: [
                        { selector: selectWettbewerbskontextLoaded, value: false },
                        { selector: selectWettbewerbskontextLoadState, value: 'not-loaded' },
                        { selector: selectWettbewerbskontext, value: undefined },
                        { selector: fromWettbewerb.selectWettbewerb, value: undefined },
                    ],
                }),
            ],
        });

        store = TestBed.inject(MockStore);
        facade = TestBed.inject(PrivatpersonFacade);

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    afterEach(() => {
        store.resetSelectors();
        vi.restoreAllMocks();
    });

    describe('observables', () => {
        it.each(['not-loaded', 'loaded', 'technical-error', 'unauthorized', 'forbidden'] as const)(
            'should expose wettbewerbskontextLoadState %s',
            async loadState => {
                store.overrideSelector(selectWettbewerbskontextLoadState, loadState);
                store.refreshState();

                const emitted = await firstValueFrom(facade.wettbewerbskontextLoadState$);

                expect(emitted).toBe(loadState);
            }
        );
    });

    describe('signals', () => {
        it('should update wettbewerbskontextLoaded when the selector result changes', () => {
            expect(facade.wettbewerbskontextLoaded()).toBe(false);

            const selector = store.overrideSelector(selectWettbewerbskontextLoaded, true);
            store.refreshState();

            expect(facade.wettbewerbskontextLoaded()).toBe(true);

            selector.setResult(false);
            store.refreshState();

            expect(facade.wettbewerbskontextLoaded()).toBe(false);
        });

        it('should expose and update wettbewerbskontext', () => {
            expect(facade.wettbewerbskontext()).toBeUndefined();

            store.overrideSelector(selectWettbewerbskontext, wettbewerbskontext);
            store.refreshState();

            expect(facade.wettbewerbskontext()).toEqual(wettbewerbskontext);

            const updatedKontext: PrivatpersonWettbewerbskontext = {
                ...wettbewerbskontext,
                anmeldungMoeglich: true,
            };

            store.overrideSelector(selectWettbewerbskontext, updatedKontext);
            store.refreshState();

            expect(facade.wettbewerbskontext()).toEqual(updatedKontext);

            store.overrideSelector(selectWettbewerbskontext, undefined);
            store.refreshState();

            expect(facade.wettbewerbskontext()).toBeUndefined();
        });
    });

    describe('methods', () => {
        it('should dispatch the correct action on dashboardVorbereiten', () => {
            facade.dashboardVorbereiten();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(
                MinikaenguruEinstiegActions.kontextLadenOnWettbewerbsorganisationGestartet({
                    durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                })
            );
        });
    });
});
