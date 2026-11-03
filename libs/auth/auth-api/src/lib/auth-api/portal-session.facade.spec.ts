import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PortalSessionFacade } from './portal-session.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AuthActions, fromAuth } from '@matheportal/auth-data';
import { anonymousUser, User } from '@matheportal/auth-model';

describe('PortalSessionFacade tests', () => {
    let facade: PortalSessionFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    const gast: User = anonymousUser;

    const loggedInUser: User = {
        // hier dein echter User-Teststub
        anonym: false,
        fullName: 'Ada Lovelace',
        berechtigungen: ['STANDARD'],
    } as User;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PortalSessionFacade, provideMockStore()],
        });

        facade = TestBed.inject(PortalSessionFacade);
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
        expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.validateSession());
    });

    it('validateSession should dispatch validateSession when user is anonymous', () => {
        store.overrideSelector(fromAuth.user, gast);
        store.refreshState();

        facade.validateSession();

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.validateSession());
    });
});
