import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { authActions } from '@matheportal/auth-data';
import { AuthFlowFacade } from './auth-flow.facade';
import { AuthSessionFacade } from './auth-session.facade';
import { AUTH_LOCATION_HASH } from '@matheportal/auth-model';

describe('AuthFlowFacade', () => {
    let facade: AuthFlowFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;
    const authLocationHashMock = vi.fn();
    const authSessionFacadeMock = {
        validateSession: vi.fn(),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthFlowFacade,
                provideMockStore(),
                {
                    provide: AUTH_LOCATION_HASH,
                    useValue: authLocationHashMock,
                },
                { provide: AuthSessionFacade, useValue: authSessionFacadeMock },
            ],
        });

        facade = TestBed.inject(AuthFlowFacade);
        store = TestBed.inject(Store) as MockStore;

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('login should dispatch requestLoginUrl', () => {
            facade.login();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.requestLoginUrl());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('logout should dispatch logOut', () => {
            facade.logout();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.logOut());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
    });

    describe('handleSessionExpired', () => {
        it('handleSessionExpired should dispatch sessionValidationFailed with expired', () => {
            facade.handleSessionExpired();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenNthCalledWith(1, authActions.sessionValidationFailed({ reason: 'expired' }));
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
    });

    describe('test initClearOrRestoreSession', () => {
        it('initClearOrRestoreSession should dispatch createSession when state=login and idToken is present', () => {
            authLocationHashMock.mockReturnValue(
                '#state=login&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenNthCalledWith(1, authActions.createSession({ idToken: 'id-token' }));
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch createSessionFailed when state=login and idToken is empty', () => {
            authLocationHashMock.mockReturnValue(
                '#state=login&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.createSessionFailed());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch createSessionFailed when state=login and idToken is missing', () => {
            authLocationHashMock.mockReturnValue('#state=login&nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.createSessionFailed());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });

        it('initClearOrRestoreSession should do nothing when state=signup and idToken is present', () => {
            authLocationHashMock.mockReturnValue(
                '#state=signup&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(0);
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should do nothing when state=signup and  idToken is empty', () => {
            authLocationHashMock.mockReturnValue(
                '#state=signup&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(0);
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should do nothing when state=signup and  idToken is missing', () => {
            authLocationHashMock.mockReturnValue('#state=signup&nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(0);
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });

        it('initClearOrRestoreSession should dispatch invalidOAuthFlowHash when state=invalid and idToken is present', () => {
            authLocationHashMock.mockReturnValue(
                '#state=foobar&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.invalidOAuthFlowHash());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch invalidOAuthFlowHash when state=invalid and idToken is empty', () => {
            authLocationHashMock.mockReturnValue('#state=&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.invalidOAuthFlowHash());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch invalidOAuthFlowHash when state=invalid and idToken is missing', () => {
            authLocationHashMock.mockReturnValue('#nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.invalidOAuthFlowHash());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch validateSession when hash is empty', () => {
            authLocationHashMock.mockReturnValue('#');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(0);
            expect(authSessionFacadeMock.validateSession).toHaveBeenCalledTimes(1);
        });
        it('initClearOrRestoreSession should dispatch validateSession when not oauthFlow', () => {
            authLocationHashMock.mockReturnValue('#state=foobar&nonce=');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(0);
            expect(authSessionFacadeMock.validateSession).toHaveBeenCalledTimes(1);
        });
    });
});
