import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of, throwError, firstValueFrom } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { provideStore } from '@ngrx/store';
import { AuthHttpService } from '../auth-http.service';
import { Router } from '@angular/router';
import { authActions } from './auth.actions';
import {
    AuthUrlResponse,
    CLEAR_AUTH_LOCATION_HASH,
    SESSION_VALIDATION_FAILED_REASON,
    User,
} from '@matheportal/auth-model';
import { HttpErrorResponse } from '@angular/common/http';
import { BrowserNavigationService } from '../browser-navigation.service';
import { ERROR_PUBLISHER } from '@matheportal/error-handling-api';

describe('AuthEffects', () => {
    let action$: ReplaySubject<unknown>;
    let effects: AuthEffects;

    const clearAuthLocationHashMock = vi.fn();

    TestBed.overrideProvider(CLEAR_AUTH_LOCATION_HASH, {
        useValue: clearAuthLocationHashMock,
    });

    const httpUnauthorizedErrorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'unauthorized',
        error: 'boom',
        url: '/session',
    });

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/authurls/login',
    });

    const httpServiceMock = {
        getLoginUrl: vi.fn(),
        createSession: vi.fn(),
        reloadSession: vi.fn(),
        logOut: vi.fn(),
    };

    const errorPublisherMock = {
        publishWarning: vi.fn(),
        publishError: vi.fn(),
    };

    const routerMock = {
        navigateByUrl: vi.fn(),
    };

    const browserNavigationServiceMock = {
        redirectToUrl: vi.fn(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
        action$ = new ReplaySubject<unknown>(1);

        TestBed.configureTestingModule({
            providers: [
                provideStore(),
                AuthEffects,
                provideMockActions(() => action$),
                { provide: AuthHttpService, useValue: httpServiceMock },
                { provide: Router, useValue: routerMock },
                {
                    provide: ERROR_PUBLISHER,
                    useValue: errorPublisherMock,
                },
                { provide: BrowserNavigationService, useValue: browserNavigationServiceMock },
                { provide: CLEAR_AUTH_LOCATION_HASH, useValue: clearAuthLocationHashMock },
            ],
        });

        effects = TestBed.inject(AuthEffects);
    });

    describe('requestLogInUrl$', () => {
        it('should call AuthHttpService and map to redirectToIam', async () => {
            const urlResponse: AuthUrlResponse = {
                url: 'iam/login',
            };

            httpServiceMock.getLoginUrl.mockReturnValue(of(urlResponse));

            action$.next(authActions.requestLoginUrl());
            const emitted = await firstValueFrom(effects.requestLogInUrl$);

            expect(emitted).toEqual(authActions.redirectToIam({ iamUrl: urlResponse.url }));
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call AuthHttpService and map to requestLoginUrlFailed when HttpErrorResponse', async () => {
            httpServiceMock.getLoginUrl.mockReturnValue(throwError(() => httpServerErrorResponse));

            action$.next(authActions.requestLoginUrl());
            const emitted = await firstValueFrom(effects.requestLogInUrl$);
            expect(emitted).toEqual(authActions.requestLoginUrlFailed());
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call AuthHttpService and map to requestLoginUrlFailed when other Error', async () => {
            httpServiceMock.getLoginUrl.mockReturnValue(throwError(() => new Error('boom')));

            action$.next(authActions.requestLoginUrl());
            const emitted = await firstValueFrom(effects.requestLogInUrl$);
            expect(emitted).toEqual(authActions.requestLoginUrlFailed());
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('redirectToIam$', () => {
        it('should redirect browser to IAM url', async () => {
            const iamUrl = 'https://iam.example.org/login';

            action$.next(authActions.redirectToIam({ iamUrl }));

            await firstValueFrom(effects.redirectToIam$);

            expect(browserNavigationServiceMock.redirectToUrl).toHaveBeenCalledWith(iamUrl);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
        });
    });

    describe('requestLoginUrlFailed$', () => {
        it('should publish an error message', async () => {
            action$.next(authActions.requestLoginUrlFailed());

            await firstValueFrom(effects.requestLoginUrlFailed$);

            expect(errorPublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
            );

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('createSession$', () => {
        it('should call AuthHttpService and map to sessionCreated', async () => {
            const userResponse: User = {
                anonym: false,
                fullName: 'Checki',
                roles: ['ADMIN', 'LEHRER'],
            };

            const idToken = 'test-id-token';

            httpServiceMock.createSession.mockReturnValue(of(userResponse));

            action$.next(authActions.createSession({ idToken }));
            const emitted = await firstValueFrom(effects.createSession$);

            expect(emitted).toEqual(authActions.sessionCreated({ user: userResponse }));
            expect(httpServiceMock.createSession).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.createSession).toHaveBeenCalledWith(idToken);

            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call AuthHttpService and map to createSessionFailed when HttpErrorResponse', async () => {
            const idToken = 'test-id-token';

            httpServiceMock.createSession.mockReturnValue(throwError(() => httpServerErrorResponse));

            action$.next(authActions.createSession({ idToken }));
            const emitted = await firstValueFrom(effects.createSession$);

            expect(emitted).toEqual(authActions.createSessionFailed());
            expect(httpServiceMock.createSession).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.createSession).toHaveBeenCalledWith(idToken);

            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call AuthHttpService and map to createSessionFailed when other Error', async () => {
            const idToken = 'test-id-token';

            httpServiceMock.createSession.mockReturnValue(throwError(() => new Error('boom')));

            action$.next(authActions.createSession({ idToken }));
            const emitted = await firstValueFrom(effects.createSession$);

            expect(emitted).toEqual(authActions.createSessionFailed());
            expect(httpServiceMock.createSession).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.createSession).toHaveBeenCalledWith(idToken);

            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('createSessionFailed$', () => {
        it('should publish error message when createSessionFailed is dispatched', async () => {
            const resultPromise = firstValueFrom(effects.createSessionFailed$);
            action$.next(authActions.createSessionFailed());

            await resultPromise;

            expect(errorPublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(errorPublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
            );

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('invalidOAuthFlowHash$', () => {
        it('should publish error message when invalidOAuthFlowHash is dispatched', async () => {
            const resultPromise = firstValueFrom(effects.invalidOAuthFlowHash$);
            action$.next(authActions.invalidOAuthFlowHash());

            await resultPromise;

            expect(errorPublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(errorPublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
            );
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('clearAuthCallbackHash$', () => {
        it.each([
            authActions.sessionCreated({
                user: {
                    anonym: false,
                    fullName: 'Checki',
                    roles: ['ADMIN'],
                },
            }),
            authActions.createSessionFailed(),
            authActions.invalidOAuthFlowHash(),
        ])('should clear auth location hash for %s', async action => {
            action$.next(action);

            await firstValueFrom(effects.clearAuthCallbackHash$);

            expect(clearAuthLocationHashMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('logOut$', () => {
        it('should call logOut and map to loggedOut', async () => {
            httpServiceMock.logOut.mockReturnValue(of(undefined));

            action$.next(authActions.logOut());

            const emitted = await firstValueFrom(effects.logOut$);

            expect(emitted).toEqual(authActions.loggedOut({ reason: 'useraction' }));
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call logOut and map to loggedOut, when HttpErrorResponse', async () => {
            httpServiceMock.logOut.mockReturnValue(throwError(() => httpServerErrorResponse));

            action$.next(authActions.logOut());

            const emitted = await firstValueFrom(effects.logOut$);

            expect(emitted).toEqual(authActions.loggedOut({ reason: 'useraction' }));
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call logOut and map to loggedOut, when general Error', async () => {
            httpServiceMock.logOut.mockReturnValue(throwError(() => new Error('boom!')));

            action$.next(authActions.logOut());

            const emitted = await firstValueFrom(effects.logOut$);

            expect(emitted).toEqual(authActions.loggedOut({ reason: 'useraction' }));
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('sessionValidationFailed$', () => {
        it.each<SESSION_VALIDATION_FAILED_REASON>(['technical', 'expired'])(
            'should call logOut and map to loggedOut, reason %i',
            async reason => {
                httpServiceMock.logOut.mockReturnValue(of(undefined));
                action$.next(authActions.sessionValidationFailed({ reason: reason }));
                const emitted = await firstValueFrom(effects.sessionValidationFailed$);

                expect(emitted).toEqual(authActions.loggedOut({ reason: reason }));
                expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

                expect(httpServiceMock.createSession).not.toHaveBeenCalled();
                expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
                expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
                expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
                expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
                expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
                expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
            }
        );

        it.each<SESSION_VALIDATION_FAILED_REASON>(['technical', 'expired'])(
            'should call logOut and map to loggedOut when HttpErrorResponse, reason %i',
            async reason => {
                httpServiceMock.logOut.mockReturnValue(throwError(() => httpServerErrorResponse));
                action$.next(authActions.sessionValidationFailed({ reason: reason }));
                const emitted = await firstValueFrom(effects.sessionValidationFailed$);

                expect(emitted).toEqual(authActions.loggedOut({ reason: reason }));
                expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

                expect(httpServiceMock.createSession).not.toHaveBeenCalled();
                expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
                expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
                expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
                expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
                expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
                expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
            }
        );

        it.each<SESSION_VALIDATION_FAILED_REASON>(['technical', 'expired'])(
            'should call logOut and map to loggedOut when general Error, reason %i',
            async reason => {
                httpServiceMock.logOut.mockReturnValue(throwError(() => new Error('boom!')));
                action$.next(authActions.sessionValidationFailed({ reason: reason }));
                const emitted = await firstValueFrom(effects.sessionValidationFailed$);

                expect(emitted).toEqual(authActions.loggedOut({ reason: reason }));
                expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);
                expect(httpServiceMock.createSession).not.toHaveBeenCalled();
                expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
                expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
                expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
                expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
                expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
                expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
            }
        );
    });

    describe('loggedOut$', () => {
        it('should publishWarning and route to home when reason expired', async () => {
            action$.next(authActions.loggedOut({ reason: 'expired' }));
            await firstValueFrom(effects.loggedOut$);

            expect(errorPublisherMock.publishWarning).toHaveBeenCalledWith(
                'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
            );
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should publishError and route to home when reason technical', async () => {
            action$.next(authActions.loggedOut({ reason: 'technical' }));
            await firstValueFrom(effects.loggedOut$);

            expect(errorPublisherMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
            );
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should not publish any message and route to home when reason useraction', async () => {
            action$.next(authActions.loggedOut({ reason: 'useraction' }));
            await firstValueFrom(effects.loggedOut$);

            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('validateSession$', () => {
        it('should call reloadSession and map to sessionValidated', async () => {
            const userResponse: User = {
                anonym: false,
                fullName: 'Checki',
                roles: ['ADMIN', 'LEHRER'],
            };

            httpServiceMock.reloadSession.mockReturnValue(of(userResponse));

            action$.next(authActions.validateSession());
            const emitted = await firstValueFrom(effects.validateSession$);

            expect(emitted).toEqual(authActions.sessionValidated({ user: userResponse }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call reloadSession and map to sessionValidationFailed with expired when http-status 401', async () => {
            httpServiceMock.reloadSession.mockReturnValue(throwError(() => httpUnauthorizedErrorResponse));

            action$.next(authActions.validateSession());
            const emitted = await firstValueFrom(effects.validateSession$);

            expect(emitted).toEqual(authActions.sessionValidationFailed({ reason: 'expired' }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call reloadSession and map to sessionValidationFailed with technical when http-status 500', async () => {
            httpServiceMock.reloadSession.mockReturnValue(throwError(() => httpServerErrorResponse));

            action$.next(authActions.validateSession());
            const emitted = await firstValueFrom(effects.validateSession$);

            expect(emitted).toEqual(authActions.sessionValidationFailed({ reason: 'technical' }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call reloadSession and map to sessionValidationFailed with technical when other error', async () => {
            httpServiceMock.reloadSession.mockReturnValue(throwError(() => new Error('boom')));

            action$.next(authActions.validateSession());
            const emitted = await firstValueFrom(effects.validateSession$);

            expect(emitted).toEqual(authActions.sessionValidationFailed({ reason: 'technical' }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishError).not.toHaveBeenCalled();
            expect(errorPublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });
});
