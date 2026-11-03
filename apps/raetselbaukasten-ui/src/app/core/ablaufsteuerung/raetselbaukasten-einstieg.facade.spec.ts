import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RaetselbaukastenEinstiegFacade } from './raetselbaukasten-einstieg.facade';
import { RaetselbaukastenEinstiegActions } from './raetselbaukasten-einstieg.actions';

describe('RaetselbaukastenEinstiegFacade', () => {
    let dispatchSpy: ReturnType<typeof vi.spyOn>;
    let facade: RaetselbaukastenEinstiegFacade;
    let store: MockStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RaetselbaukastenEinstiegFacade, provideMockStore()],
        });

        store = TestBed.inject(MockStore);
        facade = TestBed.inject(RaetselbaukastenEinstiegFacade);

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    describe('methods', () => {
        it('should dispatch the correct action on raetselbaukastenAufgerufen', () => {
            facade.raetselbaukastenAufgerufen();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(RaetselbaukastenEinstiegActions.rootEinstiegRequested());
        });
    });
});
