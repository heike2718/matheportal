import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { SchuleFacade } from './schule.facade';
import {
    selectSchulkollegiumLoaded,
    selectWettbewerbskontext,
    selectWettbewerbskontextLoaded,
    selectWettbewerbskontextLoadState,
} from '../data/+state/schule.selectors';
import { fromWettbewerb } from '../../core/wettbewerb/data/+state/wettbewerb.selectors';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../../core/wettbewerb/model/wettbewerb.model';
import { SchuleWettbewerbskontext } from '../../core/model/schule-wettbewerbskontext.model';
import { MinikaenguruEinstiegActions } from '../../core/ablaufsteuerung/minikaenguru-einstieg.actions';
import { DURCHFUEHRUNGSART } from '../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { isSchulauswahlMoeglich } from '../../lehrperson/api/public-lehrperson.selectors';
import { SchuleActions } from '../data/+state/schule.actions';

describe('SchuleFacade', () => {
    const wettbewerb: Wettbewerb = {
        beginn: '01.01.2029',
        ende: '31.07.2029',
        freischaltungPrivat: '15.06.2029',
        freischaltungSchulen: '14.03.2029',
        jahr: 2029,
        status: WETTBEWERBSSTATUS.anmeldung,
    };

    const wettbewerbskontext: SchuleWettbewerbskontext = {
        schule: {
            kuerzel: 'SCHULE-1',
            name: 'Neuhofschule',
            ort: {
                kuerzel: 'ORT-1',
                name: 'erster Ort',
                land: {
                    kuerzel: 'DE-BY',
                    name: 'Bayern',
                    anzahlOrte: 19,
                },
                anzahlSchulen: 1,
            },
        },
        anmeldungMoeglich: true,
        kollegen: ['Anna Johanna'],
        teilnahmerefs: [],
        vertragDSGVOVorhanden: true,
    };

    let facade: SchuleFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SchuleFacade,
                provideMockStore({
                    initialState: {},
                    selectors: [
                        { selector: isSchulauswahlMoeglich, value: false },
                        { selector: selectSchulkollegiumLoaded, value: false },
                        { selector: selectWettbewerbskontextLoaded, value: false },
                        { selector: selectWettbewerbskontextLoadState, value: 'not-loaded' },
                        { selector: selectWettbewerbskontext, value: undefined },
                        { selector: fromWettbewerb.selectWettbewerb, value: undefined },
                    ],
                }),
            ],
        });

        store = TestBed.inject(MockStore);
        facade = TestBed.inject(SchuleFacade);

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
        it('should update schulauswahlMoeglich when the selector result changes', () => {
            expect(facade.schulauswahlMoeglich()).toBe(false);

            const selector = store.overrideSelector(isSchulauswahlMoeglich, true);
            store.refreshState();

            expect(facade.schulauswahlMoeglich()).toBe(true);

            selector.setResult(false);
            store.refreshState();

            expect(facade.schulauswahlMoeglich()).toBe(false);
        });

        it('should update wettbewerbskontextLoaded when the selector result changes', () => {
            expect(facade.wettbewerbskontextLoaded()).toBe(false);

            const selector = store.overrideSelector(selectWettbewerbskontextLoaded, true);
            store.refreshState();

            expect(facade.wettbewerbskontextLoaded()).toBe(true);

            selector.setResult(false);
            store.refreshState();

            expect(facade.wettbewerbskontextLoaded()).toBe(false);
        });

        it('should update schulkollegiumLoaded when the selector result changes', () => {
            expect(facade.schulkollegiumLoaded()).toBe(false);

            const selector = store.overrideSelector(selectSchulkollegiumLoaded, true);
            store.refreshState();

            expect(facade.schulkollegiumLoaded()).toBe(true);

            selector.setResult(false);
            store.refreshState();

            expect(facade.schulkollegiumLoaded()).toBe(false);
        });

        it('should expose and update wettbewerbskontext', () => {
            expect(facade.wettbewerbskontext()).toBeUndefined();

            store.overrideSelector(selectWettbewerbskontext, wettbewerbskontext);
            store.refreshState();

            expect(facade.wettbewerbskontext()).toEqual(wettbewerbskontext);

            const updatedKontext: SchuleWettbewerbskontext = {
                ...wettbewerbskontext,
                kollegen: ['Anna Johanna', 'Max Mustermann'],
            };

            store.overrideSelector(selectWettbewerbskontext, updatedKontext);
            store.refreshState();

            expect(facade.wettbewerbskontext()).toEqual(updatedKontext);

            store.overrideSelector(selectWettbewerbskontext, undefined);
            store.refreshState();

            expect(facade.wettbewerbskontext()).toBeUndefined();
        });

        it('should expose and update aktuellerWettbewerb', () => {
            expect(facade.aktuellerWettbewerb()).toBeUndefined();

            store.overrideSelector(fromWettbewerb.selectWettbewerb, wettbewerb);
            store.refreshState();

            expect(facade.aktuellerWettbewerb()).toEqual(wettbewerb);

            const updatedWettbewerb: Wettbewerb = {
                ...wettbewerb,
                status: WETTBEWERBSSTATUS.beendet,
            };

            store.overrideSelector(fromWettbewerb.selectWettbewerb, updatedWettbewerb);
            store.refreshState();

            expect(facade.aktuellerWettbewerb()).toEqual(updatedWettbewerb);

            store.overrideSelector(fromWettbewerb.selectWettbewerb, undefined);
            store.refreshState();

            expect(facade.aktuellerWettbewerb()).toBeUndefined();
        });
    });

    describe('methods', () => {
        it.each(['SCHULE-1', 'SCHULE-2'])(
            'should dispatch the correct action on dashboardVorbereiten for %s',
            schulkuerzel => {
                facade.dashboardVorbereiten(schulkuerzel);

                expect(dispatchSpy).toHaveBeenCalledTimes(1);
                expect(dispatchSpy).toHaveBeenCalledWith(
                    MinikaenguruEinstiegActions.kontextLadenOnWettbewerbsorganisationGestartet({
                        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                        kontextkuerzel: schulkuerzel,
                    })
                );
            }
        );

        it('should dispatch the correct action on schuleWechselnRequested', () => {
            facade.schuleWechselnRequested();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(SchuleActions.wettbewerbsorganisationVerlassen());
        });
    });
});
