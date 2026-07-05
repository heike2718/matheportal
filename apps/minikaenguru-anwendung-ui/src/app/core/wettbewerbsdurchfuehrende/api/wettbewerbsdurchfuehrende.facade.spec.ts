import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { WettbewerbsdurchfuehrendeFacade } from './wettbewerbsdurchfuehrende.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { wettbewerbsdurchfuehrendeActions } from '../data/+state/wettbewerbsdurchfuehrende.actions';
import { DURCHFUEHRUNGSART, WettbewerbsdurchfuerenderRequest } from '../model/wettbewerbsdurchfuehrende.model';

describe('WettbewerbsdurchfuehrendeFacade tests', () => {
    let facade: WettbewerbsdurchfuehrendeFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [WettbewerbsdurchfuehrendeFacade, provideMockStore({})],
        });
        facade = TestBed.inject(WettbewerbsdurchfuehrendeFacade);
        store = TestBed.inject(Store) as MockStore;

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    it('privatpersonAnlegen should dispatch the expected action', () => {
        const requestDto: WettbewerbsdurchfuerenderRequest = {
            durchfuehrungsart: DURCHFUEHRUNGSART.privat,
            schule: null,
        };

        facade.privatpersonAnlegen();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(
            wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto })
        );
    });
});
