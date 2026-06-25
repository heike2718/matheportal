import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MkaAuthorizationFacade } from './mka-authorization.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { anonymousUser, User } from '@matheportal/auth-model';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { AuthorizationLoadState, Veranstaltertyp } from '../authorization-model';
import { fromMkaAuthorization, mkaAuthorizationActions } from '../authorization-data';

interface TestParameters {
    readonly user: User;
    readonly veranstaltertyp: Veranstaltertyp;
}

describe('MkaAuthorizationFacade tests', () => {
    let facade: MkaAuthorizationFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    let userSubject: BehaviorSubject<User>;

    const loggedInStandardUser: User = {
        anonym: false,
        fullName: 'Jonny',
        berechtigungen: ['STANDARD'],
    };

    const loggedInLehrer: User = {
        anonym: false,
        fullName: 'Frodo',
        berechtigungen: ['STANDARD', 'LEHRER'],
    };

    const loggedInPrivatveranstalter: User = {
        anonym: false,
        fullName: 'Bilbo',
        berechtigungen: ['STANDARD', 'PRIVAT'],
    };

    const veranstaltertypNone: Veranstaltertyp = 'NONE';
    const veranstaltertypLehrer: Veranstaltertyp = 'LEHRER';
    const veranstaltertypPrivat: Veranstaltertyp = 'PRIVAT';

    const authSessionFacadeMock = {
        user$: undefined as unknown as Observable<User>,
    };

    async function setup(user: User, authorizationLoadState: AuthorizationLoadState, veranstalterTyp: Veranstaltertyp) {
        userSubject = new BehaviorSubject<User>(user);

        authSessionFacadeMock.user$ = userSubject.asObservable();

        TestBed.configureTestingModule({
            providers: [
                MkaAuthorizationFacade,
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
                provideMockStore({
                    selectors: [
                        {
                            selector: fromMkaAuthorization.authorizationLoadState,
                            value: authorizationLoadState,
                        },
                        {
                            selector: fromMkaAuthorization.veranstalterTyp,
                            value: veranstalterTyp,
                        },
                    ],
                }),
            ],
        });
        facade = TestBed.inject(MkaAuthorizationFacade);
        store = TestBed.inject(Store) as MockStore;

        dispatchSpy = vi.spyOn(store, 'dispatch');
    }

    describe('startViewState tests', () => {
        it('should return guest when not logged in', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'not-loaded';
            const veranstaltertyp: Veranstaltertyp = 'NONE';
            await setup(anonymousUser, authorizationLoadState, veranstaltertyp);

            expect(facade.startViewState()).toBe('guest');
        });
        it.each([
            [{ user: loggedInStandardUser, veranstaltertyp: veranstaltertypNone }],
            [{ user: loggedInLehrer, veranstaltertyp: veranstaltertypLehrer }],
            [{ user: loggedInPrivatveranstalter, veranstaltertyp: veranstaltertypPrivat }],
        ] as [TestParameters][])(
            'should return loading when logged in with $testParameter and not-loaded',
            async testParameter => {
                const authorizationLoadState: AuthorizationLoadState = 'not-loaded';
                await setup(testParameter.user, authorizationLoadState, testParameter.veranstaltertyp);

                expect(facade.startViewState()).toBe('loading');
            }
        );
        it.each([
            [{ user: loggedInStandardUser, veranstaltertyp: veranstaltertypNone }],
            [{ user: loggedInLehrer, veranstaltertyp: veranstaltertypLehrer }],
            [{ user: loggedInPrivatveranstalter, veranstaltertyp: veranstaltertypPrivat }],
        ] as [TestParameters][])(
            'should return failed when logged in with $testParameter and failed',
            async testParameter => {
                const authorizationLoadState: AuthorizationLoadState = 'failed';
                await setup(testParameter.user, authorizationLoadState, testParameter.veranstaltertyp);

                expect(facade.startViewState()).toBe('failed');
            }
        );
        it('should return dashboard-privat when logged in as privatveranstalter', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'loaded';
            await setup(loggedInPrivatveranstalter, authorizationLoadState, veranstaltertypPrivat);

            expect(facade.startViewState()).toBe('dashboard-privat');
        });
        it('should return dashboard-lehrer when logged in as lehrer', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'loaded';
            await setup(loggedInLehrer, authorizationLoadState, veranstaltertypLehrer);

            expect(facade.startViewState()).toBe('dashboard-lehrer');
        });
        it('should return veranstalter-anlegen when logged in as standarduser', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'loaded';
            await setup(loggedInStandardUser, authorizationLoadState, veranstaltertypNone);

            expect(facade.startViewState()).toBe('veranstalter-anlegen');
        });
    });

    describe('ensureAuthorizationLoaded tests', () => {
        it.each(['not-loaded', 'failed', 'loaded'] as AuthorizationLoadState[])(
            'should dispatch the loadMkaAuthorization when user is logged in and $authorizationLoadState',
            async authorizationLoadState => {
                await setup(loggedInStandardUser, authorizationLoadState, veranstaltertypNone);

                facade.ensureAuthorizationLoaded();

                expect(dispatchSpy).toHaveBeenCalledTimes(1);
                expect(dispatchSpy).toHaveBeenCalledWith(mkaAuthorizationActions.loadMkaAuthorization());
            }
        );
        it.each(['not-loaded', 'failed', 'loaded'] as AuthorizationLoadState[])(
            'should not dispatch the loadMkaAuthorization when user is not logged in and $authorizationLoadState',
            async authorizationLoadState => {
                await setup(anonymousUser, authorizationLoadState, veranstaltertypNone);

                facade.ensureAuthorizationLoaded();

                expect(dispatchSpy).not.toHaveBeenCalled();
            }
        );
    });
    describe('userLoggedOut tests', () => {
        it.each([
            [{ user: loggedInStandardUser, veranstaltertyp: veranstaltertypNone }],
            [{ user: loggedInLehrer, veranstaltertyp: veranstaltertypLehrer }],
            [{ user: loggedInPrivatveranstalter, veranstaltertyp: veranstaltertypPrivat }],
        ] as [TestParameters][])(
            'should dispatch userLoggedOut-Action when userLoggedOut ist called with $testParameter',
            async testParameter => {
                await setup(testParameter.user, 'loaded', testParameter.veranstaltertyp);
                facade.userLoggedOut();
                expect(dispatchSpy).toHaveBeenCalledTimes(1);
                expect(dispatchSpy).toHaveBeenCalledWith(mkaAuthorizationActions.userLoggedOut());
            }
        );
    });
});
