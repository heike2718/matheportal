import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { authActions } from '@matheportal/auth-data';
import { AuthFlowFacade } from './auth-flow.facade';
import { AuthSessionFacade } from './auth-session.facade';
import { LOCATION_HASH_SERVICE } from '@matheportal/auth-data';

describe('AuthFlowFacade', () => {
    let facade: AuthFlowFacade;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;
    const locationHashServiceMock = {
        read: vi.fn(),
    };
    const authSessionFacadeMock = {
        validateSession: vi.fn(),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthFlowFacade,
                provideMockStore(),
                {
                    provide: LOCATION_HASH_SERVICE,
                    useValue: locationHashServiceMock,
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

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.requestLoginUrl());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('logout should dispatch logOut', () => {
            facade.logout();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.logOut());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
    });

    describe('test initClearOrRestoreSession', () => {
        it('initClearOrRestoreSession should dispatch createSession when state=login and idToken is present', () => {
            locationHashServiceMock.read.mockReturnValue(
                '#state=login&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenNthCalledWith(1, authActions.createSession({ idToken: 'id-token' }));
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch createSessionFailed when state=login and idToken is empty', () => {
            locationHashServiceMock.read.mockReturnValue(
                '#state=login&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.createSessionFailed());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch createSessionFailed when state=login and idToken is missing', () => {
            locationHashServiceMock.read.mockReturnValue('#state=login&nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.createSessionFailed());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });

        it('initClearOrRestoreSession should dispatch signedUp when state=signup and idToken is present', () => {
            locationHashServiceMock.read.mockReturnValue(
                '#state=signup&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.signedUp());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch signedUp when state=signup and  idToken is empty', () => {
            locationHashServiceMock.read.mockReturnValue(
                '#state=signup&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.signedUp());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch signedUp when state=signup and  idToken is missing', () => {
            locationHashServiceMock.read.mockReturnValue(
                '#state=signup&nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.signedUp());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });

        it('initClearOrRestoreSession should dispatch invalidOAuthFlowHash when state=invalid and idToken is present', () => {
            locationHashServiceMock.read.mockReturnValue(
                '#state=foobar&nonce=&idToken=id-token&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.invalidOAuthFlowHash());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch invalidOAuthFlowHash when state=invalid and idToken is empty', () => {
            locationHashServiceMock.read.mockReturnValue(
                '#state=&nonce=&idToken=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT'
            );

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.invalidOAuthFlowHash());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch invalidOAuthFlowHash when state=invalid and idToken is missing', () => {
            locationHashServiceMock.read.mockReturnValue('#nonce=&oauthFlowType=AUTHORIZATION_TOKEN_GRANT');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledOnce();
            expect(dispatchSpy).toHaveBeenCalledWith(authActions.invalidOAuthFlowHash());
            expect(authSessionFacadeMock.validateSession).not.toHaveBeenCalled();
        });
        it('initClearOrRestoreSession should dispatch validateSession when hash is empty', () => {
            locationHashServiceMock.read.mockReturnValue('#');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(0);
            expect(authSessionFacadeMock.validateSession).toHaveBeenCalledOnce();
        });
        it('initClearOrRestoreSession should dispatch validateSession when not oauthFlow', () => {
            locationHashServiceMock.read.mockReturnValue('#state=foobar&nonce=');

            facade.initClearOrRestoreSession();

            expect(dispatchSpy).toHaveBeenCalledTimes(0);
            expect(authSessionFacadeMock.validateSession).toHaveBeenCalledOnce();
        });
    });
});
