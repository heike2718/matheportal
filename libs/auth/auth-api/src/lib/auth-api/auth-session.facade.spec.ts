import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthSessionFacade } from './auth-session.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { authActions, fromAuth } from '@matheportal/auth-data';
import { anonymousUser, User } from '@matheportal/auth-model';

describe('AuthSessionFacade', () => {
    let facade: AuthSessionFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    const gast: User = anonymousUser;

    const loggedInUser: User = {
        // hier dein echter User-Teststub
        anonym: false,
        fullName: 'Ada Lovelace',
        roles: ['STANDARD'],
    } as User;

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

    it('validateSession should dispatch validateSession when user is logged in', () => {
        store.overrideSelector(fromAuth.user, loggedInUser);
        store.refreshState();

        facade.validateSession();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(authActions.validateSession());
    });

    it('validateSession should dispatch validateSession when user is anonymous', () => {
        store.overrideSelector(fromAuth.user, gast);
        store.refreshState();

        facade.validateSession();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(authActions.validateSession());
    });
});
