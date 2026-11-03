import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MkaAuthorizationFacade } from './mka-authorization.facade';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { anonymousUser, User } from '@matheportal/auth-model';

import {
    AuthorizationLoadState,
    MINIKAENGURU_BERECHTIGUNGSTYP,
    MinikaenguruBerechtigungstyp,
} from '../authorization-model';
import { fromMkaAuthorization, MkaAuthorizationActions } from '../authorization-data';
import { computed } from '@angular/core';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { RESTRICTED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

describe('MkaAuthorizationFacade tests', () => {
    let facade: MkaAuthorizationFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    const loggedInStandardUser: User = {
        anonym: false,
        fullName: 'Jonny',
        berechtigungen: ['STANDARD'],
    };

    const berechtigungstypNone: MinikaenguruBerechtigungstyp = MINIKAENGURU_BERECHTIGUNGSTYP.none;

    const portalSessionFacadeMock = {
        user: computed(() => anonymousUser),
        sessionLoadState: computed(() => 'not-loaded'),
    };

    async function setup(
        sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE,
        user: User,
        authorizationLoadState: AuthorizationLoadState,
        berechtigungstyp: MinikaenguruBerechtigungstyp
    ) {
        portalSessionFacadeMock.user = computed(() => user);
        portalSessionFacadeMock.sessionLoadState = computed(() => sessionLoadState);

        TestBed.configureTestingModule({
            providers: [
                MkaAuthorizationFacade,
                { provide: PortalSessionFacade, useValue: portalSessionFacadeMock },
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

    describe('ensureAuthorizationLoaded tests', () => {
        it.each(['not-loaded', 'loaded', 'unauthorized', 'technical-error'] as const)(
            'dispatches the ensure action when sessionLoadState is %s',
            async sessionLoadState => {
                await setup(
                    sessionLoadState,
                    sessionLoadState === 'loaded' ? loggedInStandardUser : anonymousUser,
                    'not-loaded',
                    berechtigungstypNone
                );

                facade.ensureAuthorizationLoaded();

                expect(dispatchSpy).toHaveBeenCalledTimes(1);
                expect(dispatchSpy).toHaveBeenCalledWith(MkaAuthorizationActions.ensureMkaAuthorizationLoaded());
            }
        );
    });
});
