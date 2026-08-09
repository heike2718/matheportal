import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { WettbewerbsdurchfuehrendeFacade } from './wettbewerbsdurchfuehrende.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { wettbewerbsdurchfuehrendeActions } from '../data/+state/wettbewerbsdurchfuehrende.actions';

describe('WettbewerbsdurchfuehrendeFacade tests', () => {
    let facade: WettbewerbsdurchfuehrendeFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WettbewerbsdurchfuehrendeFacade, provideMockStore({})],
        });
        facade = TestBed.inject(WettbewerbsdurchfuehrendeFacade);
        store = TestBed.inject(Store) as MockStore;

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    it('durchfuehrungsartPrivatGewaehlt should dispatch the expected action', () => {
        facade.durchfuehrungsartPrivatGewaehlt();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(wettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt());
    });

    it('durchfuehrungsartSchuleGewaehlt should dispatch the expected action', () => {
        facade.durchfuehrungsartSchuleGewaehlt();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(wettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt());
    });
});
