import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, throwError, firstValueFrom, Subject } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { Action, provideStore } from '@ngrx/store';
import { AuthHttpService } from '../auth-http.service';
import { authActions } from './auth.actions';
import { AuthUrlResponse, User } from '@matheportal/auth-model';
import { HttpErrorResponse } from '@angular/common/http';
import { BrowserNavigationService } from '../browser-navigation.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { LOCATION_HASH_SERVICE } from '../location-hash.service';

describe('AuthEffects', () => {
    let action$: Subject<Action>;
    let effects: AuthEffects;

    const expectedTechnicalErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    const httpUnauthorizedExpiredErrorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        url: '/session',
        error: {
            reason: 'expired',
        },
    });

    const httpUnauthorizedMissingErrorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        url: '/session',
        error: {
            reason: 'missing',
        },
    });

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/authurls/login',
    });

    const httpServiceMock = {
        getLoginUrl: vi.fn(),
        getSignupUrl: vi.fn(),
        createSession: vi.fn(),
        reloadSession: vi.fn(),
        logOut: vi.fn(),
    };

    const messagePublisherMock = {
        publishInfo: vi.fn(),
        publishWarning: vi.fn(),
        publishError: vi.fn(),
    };

    const browserNavigationServiceMock = {
        redirectToUrl: vi.fn(),
    };

    const locationHashServiceMock = {
        read: vi.fn(),
        clear: vi.fn(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new Subject<Action>();

        TestBed.configureTestingModule({
            providers: [
                provideStore(),
                AuthEffects,
                provideMockActions(() => action$),
                { provide: AuthHttpService, useValue: httpServiceMock },
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
                { provide: BrowserNavigationService, useValue: browserNavigationServiceMock },
                { provide: LOCATION_HASH_SERVICE, useValue: locationHashServiceMock },
            ],
        });

        effects = TestBed.inject(AuthEffects);
    });

    describe('requestLoginUrl$', () => {
        it('should call AuthHttpService and map to redirectToIam', async () => {
            const urlResponse: AuthUrlResponse = {
                url: 'iam/login',
            };

            httpServiceMock.getLoginUrl.mockReturnValue(of(urlResponse));

            const promise = firstValueFrom(effects.requestLoginUrl$);

            action$.next(authActions.requestLoginUrl());

            const emitted = await promise;

            expect(emitted).toEqual(authActions.redirectToIam({ iamUrl: urlResponse.url }));
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);
        });

        it('should call AuthHttpService and map to requestLoginUrlFailed when HttpErrorResponse', async () => {
            httpServiceMock.getLoginUrl.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.requestLoginUrl$);

            action$.next(authActions.requestLoginUrl());

            const emitted = await promise;

            expect(emitted).toEqual(authActions.requestLoginUrlFailed());
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);
        });

        it('should call AuthHttpService and map to requestLoginUrlFailed when other Error', async () => {
            httpServiceMock.getLoginUrl.mockReturnValue(throwError(() => new Error('boom')));

            const promise = firstValueFrom(effects.requestLoginUrl$);

            action$.next(authActions.requestLoginUrl());

            const emitted = await promise;

            expect(emitted).toEqual(authActions.requestLoginUrlFailed());
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);
        });
    });

    describe('redirectToIam$', () => {
        it('should redirect browser to IAM url', async () => {
            const iamUrl = 'https://iam.example.org/login';

            const promise = firstValueFrom(effects.redirectToIam$);

            action$.next(authActions.redirectToIam({ iamUrl }));

            await promise;

            expect(browserNavigationServiceMock.redirectToUrl).toHaveBeenCalledWith(iamUrl);
        });
    });

    describe('requestLoginUrlFailed$', () => {
        it('should publish an error message', async () => {
            const promise = firstValueFrom(effects.requestLoginUrlFailed$);

            action$.next(authActions.requestLoginUrlFailed());

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);
        });
    });

    describe('requestSignupUrl$', () => {
        it('should call AuthHttpService and map to redirectToIam', async () => {
            const urlResponse: AuthUrlResponse = {
                url: 'iam/signup',
            };

            httpServiceMock.getSignupUrl.mockReturnValue(of(urlResponse));

            const promise = firstValueFrom(effects.requestSignupUrl$);

            action$.next(authActions.requestSignupUrl());

            const emitted = await promise;

            expect(emitted).toEqual(authActions.redirectToIam({ iamUrl: urlResponse.url }));
            expect(httpServiceMock.getSignupUrl).toHaveBeenCalledTimes(1);
        });

        it('should publish an error message', async () => {
            const promise = firstValueFrom(effects.requestSignupUrlFailed$);

            action$.next(authActions.requestSignupUrlFailed());

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);
        });
    });

    describe('signedUp$', () => {
        it('should publish an info message', async () => {
            const promise = firstValueFrom(effects.signedUp$);

            action$.next(authActions.signedUp());

            await promise;

            expect(messagePublisherMock.publishInfo).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishInfo).toHaveBeenCalledWith(
                'Ihr Benutzerkonto wurde erfolgreich angelegt. Bevor Sie sich einloggen, muss es noch aktiviert werden. Bitte prüfen Sie Ihre Mail.'
            );
        });
    });

    describe('createSession$', () => {
        it('should call AuthHttpService and map to sessionCreated', async () => {
            const userResponse: User = {
                anonym: false,
                fullName: 'Checki',
                berechtigungen: ['ADMIN', 'SCHULE'],
            };

            const idToken = 'test-id-token';

            httpServiceMock.createSession.mockReturnValue(of(userResponse));

            const promise = firstValueFrom(effects.createSession$);

            action$.next(authActions.createSession({ idToken }));

            const emitted = await promise;

            expect(emitted).toEqual(authActions.sessionCreated({ user: userResponse }));
            expect(httpServiceMock.createSession).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.createSession).toHaveBeenCalledWith(idToken);
        });

        it('should call AuthHttpService and map to createSessionFailed when HttpErrorResponse', async () => {
            const idToken = 'test-id-token';

            httpServiceMock.createSession.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.createSession$);

            action$.next(authActions.createSession({ idToken }));

            const emitted = await promise;

            expect(emitted).toEqual(authActions.createSessionFailed());
            expect(httpServiceMock.createSession).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.createSession).toHaveBeenCalledWith(idToken);
        });

        it('should call AuthHttpService and map to createSessionFailed when other Error', async () => {
            const idToken = 'test-id-token';

            httpServiceMock.createSession.mockReturnValue(throwError(() => new Error('boom')));

            const promise = firstValueFrom(effects.createSession$);

            action$.next(authActions.createSession({ idToken }));

            const emitted = await promise;

            expect(emitted).toEqual(authActions.createSessionFailed());
            expect(httpServiceMock.createSession).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.createSession).toHaveBeenCalledWith(idToken);
        });

        it('should publish error message when createSessionFailed is dispatched', async () => {
            const promise = firstValueFrom(effects.createSessionFailed$);

            action$.next(authActions.createSessionFailed());

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);
        });
    });

    describe('invalidOAuthFlowHash$', () => {
        it('should publish error message when invalidOAuthFlowHash is dispatched', async () => {
            const promise = firstValueFrom(effects.invalidOAuthFlowHash$);
            action$.next(authActions.invalidOAuthFlowHash());

            await promise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);
        });
    });

    describe('clearAuthCallbackHash$', () => {
        it.each([
            authActions.sessionCreated({
                user: {
                    anonym: false,
                    fullName: 'Checki',
                    berechtigungen: ['ADMIN'],
                },
            }),
            authActions.signedUp(),
            authActions.createSessionFailed(),
            authActions.invalidOAuthFlowHash(),
        ])('should clear auth location hash for %s', async action => {
            const promise = firstValueFrom(effects.clearAuthCallbackHash$);

            action$.next(action);

            await promise;

            expect(locationHashServiceMock.clear).toHaveBeenCalledOnce();
        });
    });

    describe('validateSession$', () => {
        it('should call reloadSession and map to sessionValidated', async () => {
            const userResponse: User = {
                anonym: false,
                fullName: 'Checki',
                berechtigungen: ['ADMIN', 'SCHULE'],
            };

            const promise = firstValueFrom(effects.validateSession$);

            httpServiceMock.reloadSession.mockReturnValue(of(userResponse));

            action$.next(authActions.validateSession());
            const emitted = await promise;

            expect(emitted).toEqual(authActions.sessionValidated({ user: userResponse }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);
        });

        it('should call reloadSession and map to sessionValidationFailed with expired when http-status 401 and reason expired', async () => {
            httpServiceMock.reloadSession.mockReturnValue(throwError(() => httpUnauthorizedExpiredErrorResponse));

            const promise = firstValueFrom(effects.validateSession$);

            action$.next(authActions.validateSession());
            const emitted = await promise;

            expect(emitted).toEqual(authActions.sessionValidationFailed({ reason: 'expired' }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);
        });

        it('should call reloadSession and map to sessionValidationFailed with missing when http-status 401 and reason missing', async () => {
            httpServiceMock.reloadSession.mockReturnValue(throwError(() => httpUnauthorizedMissingErrorResponse));

            const promise = firstValueFrom(effects.validateSession$);
            action$.next(authActions.validateSession());
            const emitted = await promise;

            expect(emitted).toEqual(authActions.sessionValidationFailed({ reason: 'missing' }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);
        });

        it('should call reloadSession and map to sessionValidationFailed with technical when http-status 500', async () => {
            httpServiceMock.reloadSession.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.validateSession$);

            action$.next(authActions.validateSession());
            const emitted = await promise;

            expect(emitted).toEqual(authActions.sessionValidationFailed({ reason: 'technical' }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);
        });

        it('should call reloadSession and map to sessionValidationFailed with technical when other error', async () => {
            httpServiceMock.reloadSession.mockReturnValue(throwError(() => new Error('boom')));

            const promise = firstValueFrom(effects.validateSession$);

            action$.next(authActions.validateSession());
            const emitted = await promise;

            expect(emitted).toEqual(authActions.sessionValidationFailed({ reason: 'technical' }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);
        });
    });

    describe('logOut$', () => {
        it('should call logOut and map to loggedOut when success', async () => {
            httpServiceMock.logOut.mockReturnValue(() => of());

            const promise = firstValueFrom(effects.logOut$);

            action$.next(authActions.logOut());
            const emmited = await promise;

            expect(emmited).toEqual(authActions.loggedOut());
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);
        });

        it('should call logOut and map to loggedOut when httpError', async () => {
            httpServiceMock.logOut.mockReturnValue(throwError(() => httpServerErrorResponse));

            const promise = firstValueFrom(effects.logOut$);

            action$.next(authActions.logOut());
            const emmited = await promise;

            expect(emmited).toEqual(authActions.loggedOut());
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);
        });

        it('should call logOut and map to loggedOut when Error', async () => {
            httpServiceMock.logOut.mockReturnValue(throwError(() => new Error('boom!')));

            const promise = firstValueFrom(effects.logOut$);

            action$.next(authActions.logOut());
            const emmited = await promise;

            expect(emmited).toEqual(authActions.loggedOut());
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);
        });
    });
});
