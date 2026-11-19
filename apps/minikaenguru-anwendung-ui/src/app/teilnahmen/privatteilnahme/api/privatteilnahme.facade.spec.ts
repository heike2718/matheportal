import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DURCHFUEHRUNGSART } from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { Teilnahme } from '../../model/teilnahme.model';
import { PrivatteilnahmeFacade } from './privatteilnahme.facade';
import {
    selectAktuelleTeilnahmeLoaded,
    selectAngemeldet,
    selectTeilnahme,
    selectTeilnahmeLoadState,
} from '../data/+state/privatteilnahme.selectors';
import { PrivatteilnahmeActions } from '../data/+state/privatteilnahme.actions';

describe('PrivatteilnahmeFacade', () => {
    const teilnahme: Teilnahme = {
        angemeldetAm: '27.02.2027',
        anzahlKinder: 56,
        anzahlKlassen: 0,
        anzahlLoesungszettel: 14,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
        jahr: 2027,
        kuerzel: 'P123456789',
    };

    let facade: PrivatteilnahmeFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PrivatteilnahmeFacade,
                provideMockStore({
                    initialState: {},
                    selectors: [
                        {
                            selector: selectAktuelleTeilnahmeLoaded,
                            value: false,
                        },
                        {
                            selector: selectAngemeldet,
                            value: false,
                        },
                        {
                            selector: selectTeilnahme,
                            value: undefined,
                        },
                        {
                            selector: selectTeilnahmeLoadState,
                            value: 'not-loaded',
                        },
                    ],
                }),
            ],
        });

        store = TestBed.inject(MockStore);
        facade = TestBed.inject(PrivatteilnahmeFacade);

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    afterEach(() => {
        store.resetSelectors();
        vi.restoreAllMocks();
    });

    describe('Observables', () => {
        it.each(['not-loaded', 'loaded', 'not-found', 'technical-error'] as const)(
            'should expose teilnahmeLoadState %s',
            async loadState => {
                store.overrideSelector(selectTeilnahmeLoadState, loadState);
                store.refreshState();

                const emitted = await firstValueFrom(facade.teilnahmeLoadState$);

                expect(emitted).toBe(loadState);
            }
        );
    });

    describe('Signals', () => {
        it('should update aktuelleTeilnahmeLoaded when selector result changes', () => {
            expect(facade.aktuelleTeilnahmeLoaded()).toBe(false);

            const selector = store.overrideSelector(selectAktuelleTeilnahmeLoaded, true);
            store.refreshState();

            expect(facade.aktuelleTeilnahmeLoaded()).toBe(true);

            selector.setResult(false);
            store.refreshState();

            expect(facade.aktuelleTeilnahmeLoaded()).toBe(false);
        });

        it('should update angemeldet when selector result changes', () => {
            expect(facade.angemeldet()).toBe(false);

            const selector = store.overrideSelector(selectAngemeldet, true);
            store.refreshState();

            expect(facade.angemeldet()).toBe(true);

            selector.setResult(false);
            store.refreshState();

            expect(facade.angemeldet()).toBe(false);
        });

        it('should update aktuelleTeilnahme when selector result changes', () => {
            expect(facade.aktuelleTeilnahme()).toBe(undefined);

            const selector = store.overrideSelector(selectTeilnahme, teilnahme);
            store.refreshState();

            expect(facade.aktuelleTeilnahme()).toEqual(teilnahme);

            selector.setResult(undefined);
            store.refreshState();

            expect(facade.aktuelleTeilnahme()).toBe(undefined);
        });
    });

    describe('methods', () => {
        it('should dispatch the correct action on aktuellePrivatteilnahmeVorbereiten', () => {
            facade.aktuellePrivatteilnahmeVorbereiten();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(PrivatteilnahmeActions.ensurePrivatteilnahmeGeladen());
        });

        it('should dispatch the correct action on privatteilnahmeAnmelden', () => {
            facade.privatteilnahmeAnmelden();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(PrivatteilnahmeActions.privatteilnahmeAnmelden());
        });
    });
});
