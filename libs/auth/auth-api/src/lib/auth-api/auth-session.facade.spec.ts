import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthSessionFacade } from './auth-session.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { authActions } from '@matheportal/auth-data';

describe('AuthSessionFacade', () => {
    let facade: AuthSessionFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthSessionFacade, provideMockStore()],
        });

        facade = TestBed.inject(AuthSessionFacade);
        store = TestBed.inject(Store) as MockStore;

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('validateSession should dispatch validateSession', () => {
        facade.validateSession();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(authActions.validateSession());
    });
});
