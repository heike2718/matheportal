import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { WettbewerbFacade } from './wettbewerb.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { fromWettbewerb } from '../data/+state/wettbewerb.selectors';
import { firstValueFrom } from 'rxjs';

describe('Wettbewerbsfacade', () => {
    let facade: WettbewerbFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WettbewerbFacade, provideMockStore({})],
        });
        facade = TestBed.inject(WettbewerbFacade);
        store = TestBed.inject(Store) as MockStore;

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    it('should expose the wettbewerbLoadState', async () => {
        store.overrideSelector(fromWettbewerb.selectWettbewerbLoadState, 'technical-error');

        const emitted = await firstValueFrom(facade.wettbewerbLoadState$);

        expect(emitted).toBe('technical-error');
    });
});
