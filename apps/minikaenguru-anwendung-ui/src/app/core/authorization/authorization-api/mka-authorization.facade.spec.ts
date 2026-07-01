import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MkaAuthorizationFacade } from './mka-authorization.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { anonymousUser, User } from '@matheportal/auth-model';
import { AuthFlowFacade, AuthSessionFacade } from '@matheportal/auth-api';
import {
    AuthorizationLoadState,
    MINIKAENGURU_BERECHTIGUNGSTYP,
    MinikaenguruBerechtigungstyp,
} from '../authorization-model';
import { fromMkaAuthorization, mkaAuthorizationActions } from '../authorization-data';
import { computed } from '@angular/core';

interface TestParameters {
    readonly user: User;
    readonly berechtigungstyp: MinikaenguruBerechtigungstyp;
}

describe('MkaAuthorizationFacade tests', () => {
    let facade: MkaAuthorizationFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    const loggedInStandardUser: User = {
        anonym: false,
        fullName: 'Jonny',
        berechtigungen: ['STANDARD'],
    };

    const loggedInLehrer: User = {
        anonym: false,
        fullName: 'Frodo',
        berechtigungen: ['STANDARD', 'SCHULE'],
    };

    const loggedInPrivatperson: User = {
        anonym: false,
        fullName: 'Bilbo',
        berechtigungen: ['STANDARD', 'PRIVAT'],
    };

    const berechtigungstypNone: MinikaenguruBerechtigungstyp = MINIKAENGURU_BERECHTIGUNGSTYP.none;
    const berechtigungstypSchule: MinikaenguruBerechtigungstyp = MINIKAENGURU_BERECHTIGUNGSTYP.schule;
    const berechtigungstypPrivat: MinikaenguruBerechtigungstyp = MINIKAENGURU_BERECHTIGUNGSTYP.privat;

    const authSessionFacadeMock = {
        user: computed(() => anonymousUser),
        isLoggedIn: computed(() => false),
    };

    const authFlowFacadeMock = {
        registerObserver: vi.fn(),
    };

    async function setup(
        user: User,
        authorizationLoadState: AuthorizationLoadState,
        berechtigungstyp: MinikaenguruBerechtigungstyp
    ) {
        authSessionFacadeMock.user = computed(() => user);
        authSessionFacadeMock.isLoggedIn = computed(() => !user.anonym);

        TestBed.configureTestingModule({
            providers: [
                MkaAuthorizationFacade,
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
                { provide: AuthFlowFacade, useValue: authFlowFacadeMock },
                provideMockStore({
                    selectors: [
                        {
                            selector: fromMkaAuthorization.authorizationLoadState,
                            value: authorizationLoadState,
                        },
                        {
                            selector: fromMkaAuthorization.berechtigungstyp,
                            value: berechtigungstyp,
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
            const berechtigungstyp: MinikaenguruBerechtigungstyp = MINIKAENGURU_BERECHTIGUNGSTYP.none;
            await setup(anonymousUser, authorizationLoadState, berechtigungstyp);

            expect(facade.startViewState()).toBe('guest');
        });
        it.each([
            [{ user: loggedInStandardUser, berechtigungstyp: berechtigungstypNone }],
            [{ user: loggedInLehrer, berechtigungstyp: berechtigungstypSchule }],
            [{ user: loggedInPrivatperson, berechtigungstyp: berechtigungstypPrivat }],
        ] as [TestParameters][])(
            'should return loading when logged in with $testParameter and not-loaded',
            async testParameter => {
                const authorizationLoadState: AuthorizationLoadState = 'not-loaded';
                await setup(testParameter.user, authorizationLoadState, testParameter.berechtigungstyp);

                expect(facade.startViewState()).toBe('loading');
            }
        );
        it.each([
            [{ user: loggedInStandardUser, berechtigungstyp: berechtigungstypNone }],
            [{ user: loggedInLehrer, berechtigungstyp: berechtigungstypSchule }],
            [{ user: loggedInPrivatperson, berechtigungstyp: berechtigungstypPrivat }],
        ] as [TestParameters][])(
            'should return failed when logged in with $testParameter and failed',
            async testParameter => {
                const authorizationLoadState: AuthorizationLoadState = 'failed';
                await setup(testParameter.user, authorizationLoadState, testParameter.berechtigungstyp);

                expect(facade.startViewState()).toBe('failed');
            }
        );
        it('should return dashboard-privatperson when logged in as Privatperson', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'loaded';
            await setup(loggedInPrivatperson, authorizationLoadState, berechtigungstypPrivat);

            expect(facade.startViewState()).toBe('dashboard-privatperson');
        });
        it('should return dashboard-lehrperson when logged in with berechtigung SCHULE', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'loaded';
            await setup(loggedInLehrer, authorizationLoadState, berechtigungstypSchule);

            expect(facade.startViewState()).toBe('dashboard-lehrperson');
        });
        it('should return wettbewerbsdurchfuehrenden-anlegen when logged in as standarduser', async () => {
            const authorizationLoadState: AuthorizationLoadState = 'loaded';
            await setup(loggedInStandardUser, authorizationLoadState, berechtigungstypNone);

            expect(facade.startViewState()).toBe('wettbewerbsdurchfuehrenden-anlegen');
        });
    });

    describe('ensureAuthorizationLoaded tests', () => {
        it.each(['not-loaded', 'failed', 'loaded'] as AuthorizationLoadState[])(
            'should dispatch the loadMkaAuthorization when user is logged in and $authorizationLoadState',
            async authorizationLoadState => {
                await setup(loggedInStandardUser, authorizationLoadState, berechtigungstypNone);

                expect(authFlowFacadeMock.registerObserver).toHaveBeenCalled();
                facade.ensureAuthorizationLoaded();

                expect(dispatchSpy).toHaveBeenCalledTimes(1);
                expect(dispatchSpy).toHaveBeenCalledWith(mkaAuthorizationActions.loadMkaAuthorization());
            }
        );
        it.each(['not-loaded', 'failed', 'loaded'] as AuthorizationLoadState[])(
            'should not dispatch the loadMkaAuthorization when user is not logged in and $authorizationLoadState',
            async authorizationLoadState => {
                await setup(anonymousUser, authorizationLoadState, berechtigungstypNone);

                facade.ensureAuthorizationLoaded();

                expect(dispatchSpy).not.toHaveBeenCalled();
            }
        );
    });
});
