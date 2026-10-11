import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { WettbewerbsdurchfuehrendeFacade } from './wettbewerbsdurchfuehrende.facade';
import { WettbewerbsdurchfuehrendeActions } from '../data/+state/wettbewerbsdurchfuehrende.actions';
import { fromWettbewerbsdurchfuehrender } from '../data/+state/wettbewerbsdurchfuehrende.selectors';
import {
    DURCHFUEHRUNGSART,
    Wettbewerbsdurchfuehrender,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../model/wettbewerbsdurchfuehrende.model';

describe('WettbewerbsdurchfuehrendeFacade', () => {
    const durchfuehrender: Wettbewerbsdurchfuehrender = {
        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
        newsletter: false,
        zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
    };

    let facade: WettbewerbsdurchfuehrendeFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WettbewerbsdurchfuehrendeFacade,
                provideMockStore({
                    initialState: {},
                    selectors: [
                        {
                            selector: fromWettbewerbsdurchfuehrender.selectDurchfuehrender,
                            value: durchfuehrender,
                        },
                    ],
                }),
            ],
        });

        store = TestBed.inject(MockStore);
        facade = TestBed.inject(WettbewerbsdurchfuehrendeFacade);

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    afterEach(() => {
        store.resetSelectors();
        vi.restoreAllMocks();
    });

    describe('signals', () => {
        it('should expose wettbewerbsdurchfuehrender', () => {
            expect(facade.wettbewerbsdurchfuehrender()).toEqual(durchfuehrender);
        });

        it('should update wettbewerbsdurchfuehrender when the selector result changes', () => {
            expect(facade.wettbewerbsdurchfuehrender()).toEqual(durchfuehrender);

            const updatedDurchfuehrender: Wettbewerbsdurchfuehrender = {
                ...durchfuehrender,
                newsletter: true,
            };

            store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrender, updatedDurchfuehrender);
            store.refreshState();

            expect(facade.wettbewerbsdurchfuehrender()).toEqual(updatedDurchfuehrender);
        });

        it('should expose undefined when the durchfuehrender is cleared', () => {
            store.overrideSelector(fromWettbewerbsdurchfuehrender.selectDurchfuehrender, undefined);
            store.refreshState();

            expect(facade.wettbewerbsdurchfuehrender()).toBeUndefined();
        });
    });

    describe('methods', () => {
        it('should dispatch the correct action on durchfuehrungsartPrivatGewaehlt', () => {
            facade.durchfuehrungsartPrivatGewaehlt();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(
                WettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt()
            );
        });

        it('should dispatch the correct action on durchfuehrungsartSchuleGewaehlt', () => {
            facade.durchfuehrungsartSchuleGewaehlt();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(
                WettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt()
            );
        });
    });
});
