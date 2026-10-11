import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Schule } from '../../core/model/schulkatalog.model';
import { LehrpersonFacade } from './lehrperson.facade';
import { TestBed } from '@angular/core/testing';
import { selectSchulen, selectSchulenLoaded } from '../../schulen/data/+state/schulen.selectors';
import { LehrpersonActions } from '../data/+state/lehrperson.actions';

describe('LehrpersonFacade', () => {
    const schulen: Schule[] = [
        {
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
    ];

    let facade: LehrpersonFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LehrpersonFacade,
                provideMockStore({
                    initialState: {},
                    selectors: [
                        { selector: selectSchulen, value: schulen },
                        { selector: selectSchulenLoaded, value: false },
                    ],
                }),
            ],
        });

        store = TestBed.inject(MockStore);
        facade = TestBed.inject(LehrpersonFacade);

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    afterEach(() => {
        store.resetSelectors();
        vi.restoreAllMocks();
    });

    describe('signals', () => {
        it('should expose schulen', () => {
            expect(facade.schulen()).toEqual(schulen);
        });

        it('should expose isSchulenLoaded as false', () => {
            expect(facade.isSchulenLoaded()).toBe(false);
        });

        it('should update schulen when the selector result changes', () => {
            expect(facade.schulen()).toEqual(schulen);

            const updatedSchulen: Schule[] = [
                {
                    ...schulen[0],
                    kuerzel: 'SCHULE-2',
                    name: 'Albert-Einstein-Schule',
                },
            ];

            store.overrideSelector(selectSchulen, updatedSchulen);
            store.refreshState();

            expect(facade.schulen()).toEqual(updatedSchulen);
        });

        it('should update isSchulenLoaded when the selector result changes', () => {
            expect(facade.isSchulenLoaded()).toBe(false);

            const selector = store.overrideSelector(selectSchulenLoaded, true);
            store.refreshState();

            expect(facade.isSchulenLoaded()).toBe(true);

            selector.setResult(false);
            store.refreshState();

            expect(facade.isSchulenLoaded()).toBe(false);
        });
    });

    describe('methods', () => {
        it('should dispatch the correct action on schuleAusgewaehlt', () => {
            facade.schuleAusgewaehlt(schulen[0]);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(
                LehrpersonActions.wettbewerbsorganisationGestartet({ schulkuerzel: 'SCHULE-1' })
            );
        });
    });
});
