import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of, throwError, firstValueFrom } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { provideStore } from '@ngrx/store';
import { AuthHttpService } from '../auth-http.service';
import { Router } from '@angular/router';
import { authActions } from './auth.actions';
import { AuthUrlResponse, User } from '@matheportal/auth-model';
import { HttpErrorResponse } from '@angular/common/http';
import { BrowserNavigationService } from '../browser-navigation.service';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { LOCATION_HASH_SERVICE } from '../location-hash.service';

describe('AuthEffects', () => {
    let action$: ReplaySubject<unknown>;
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

    const routerMock = {
        navigateByUrl: vi.fn(),
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
        action$ = new ReplaySubject<unknown>(1);

        TestBed.configureTestingModule({
            providers: [
                provideStore(),
                AuthEffects,
                provideMockActions(() => action$),
                { provide: AuthHttpService, useValue: httpServiceMock },
                { provide: Router, useValue: routerMock },
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

            action$.next(authActions.requestLoginUrl());
            const emitted = await firstValueFrom(effects.requestLoginUrl$);

            expect(emitted).toEqual(authActions.redirectToIam({ iamUrl: urlResponse.url }));
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call AuthHttpService and map to requestLoginUrlFailed when HttpErrorResponse', async () => {
            httpServiceMock.getLoginUrl.mockReturnValue(throwError(() => httpServerErrorResponse));

            action$.next(authActions.requestLoginUrl());
            const emitted = await firstValueFrom(effects.requestLoginUrl$);
            expect(emitted).toEqual(authActions.requestLoginUrlFailed());
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call AuthHttpService and map to requestLoginUrlFailed when other Error', async () => {
            httpServiceMock.getLoginUrl.mockReturnValue(throwError(() => new Error('boom')));

            action$.next(authActions.requestLoginUrl());
            const emitted = await firstValueFrom(effects.requestLoginUrl$);
            expect(emitted).toEqual(authActions.requestLoginUrlFailed());
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
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
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
        });
    });

    describe('requestLoginUrlFailed$', () => {
        it('should publish an error message', async () => {
            action$.next(authActions.requestLoginUrlFailed());

            await firstValueFrom(effects.requestLoginUrlFailed$);

            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('requestSignupUrl$', () => {
        it('should call AuthHttpService and map to redirectToIam', async () => {
            const urlResponse: AuthUrlResponse = {
                url: 'iam/signup',
            };

            httpServiceMock.getSignupUrl.mockReturnValue(of(urlResponse));

            action$.next(authActions.requestSignupUrl());
            const emitted = await firstValueFrom(effects.requestSignupUrl$);

            expect(emitted).toEqual(authActions.redirectToIam({ iamUrl: urlResponse.url }));
            expect(httpServiceMock.getSignupUrl).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('requestSignupUrlFailed$', () => {
        it('should publish an error message', async () => {
            action$.next(authActions.requestSignupUrlFailed());

            await firstValueFrom(effects.requestSignupUrlFailed$);

            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('signedUp$', () => {
        it('should publish an info message', async () => {
            action$.next(authActions.signedUp());

            await firstValueFrom(effects.signedUp$);

            expect(messagePublisherMock.publishInfo).toHaveBeenCalledOnce();
            expect(messagePublisherMock.publishInfo).toHaveBeenCalledWith(
                'Ihr Benutzerkonto wurde erfolgreich angelegt. Bevor Sie sich einloggen, muss es noch aktiviert werden. Bitte prüfen Sie Ihre Mail.'
            );

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
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

            action$.next(authActions.createSession({ idToken }));
            const emitted = await firstValueFrom(effects.createSession$);

            expect(emitted).toEqual(authActions.sessionCreated({ user: userResponse }));
            expect(httpServiceMock.createSession).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.createSession).toHaveBeenCalledWith(idToken);

            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
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
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
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
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('createSessionFailed$', () => {
        it('should publish error message when createSessionFailed is dispatched', async () => {
            const resultPromise = firstValueFrom(effects.createSessionFailed$);
            action$.next(authActions.createSessionFailed());

            await resultPromise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('invalidOAuthFlowHash$', () => {
        it('should publish error message when invalidOAuthFlowHash is dispatched', async () => {
            const resultPromise = firstValueFrom(effects.invalidOAuthFlowHash$);
            action$.next(authActions.invalidOAuthFlowHash());

            await resultPromise;

            expect(messagePublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
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
                    berechtigungen: ['ADMIN'],
                },
            }),
            authActions.signedUp(),
            authActions.createSessionFailed(),
            authActions.invalidOAuthFlowHash(),
        ])('should clear auth location hash for %s', async action => {
            action$.next(action);

            await firstValueFrom(effects.clearAuthCallbackHash$);

            expect(locationHashServiceMock.clear).toHaveBeenCalledOnce();
            expect(locationHashServiceMock.read).not.toHaveBeenCalled();
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
        });
    });

    describe('sessionValidationFailed$', () => {
        it('should show warning when session validation failed with expired and redirect to home', async () => {
            httpServiceMock.logOut.mockReturnValue(of(undefined));
            action$.next(authActions.sessionValidationFailed({ reason: 'expired' }));
            await firstValueFrom(effects.sessionValidationFailed$);

            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishWarning).toHaveBeenCalledWith(
                'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
            );
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should show nothing when session validation failed with missing, but not redirect to home', async () => {
            httpServiceMock.logOut.mockReturnValue(of(undefined));
            action$.next(authActions.sessionValidationFailed({ reason: 'missing' }));
            await firstValueFrom(effects.sessionValidationFailed$);

            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should show error when session validation failed with technical and redirect to home', async () => {
            httpServiceMock.logOut.mockReturnValue(of(undefined));
            action$.next(authActions.sessionValidationFailed({ reason: 'technical' }));
            await firstValueFrom(effects.sessionValidationFailed$);

            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).toHaveBeenCalledTimes(1);
            expect(messagePublisherMock.publishError).toHaveBeenCalledWith(expectedTechnicalErrorMessage);
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('validateSession$', () => {
        it('should call reloadSession and map to sessionValidated', async () => {
            const userResponse: User = {
                anonym: false,
                fullName: 'Checki',
                berechtigungen: ['ADMIN', 'SCHULE'],
            };

            httpServiceMock.reloadSession.mockReturnValue(of(userResponse));

            action$.next(authActions.validateSession());
            const emitted = await firstValueFrom(effects.validateSession$);

            expect(emitted).toEqual(authActions.sessionValidated({ user: userResponse }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call reloadSession and map to sessionValidationFailed with expired when http-status 401 and reason expired', async () => {
            httpServiceMock.reloadSession.mockReturnValue(throwError(() => httpUnauthorizedExpiredErrorResponse));

            action$.next(authActions.validateSession());
            const emitted = await firstValueFrom(effects.validateSession$);

            expect(emitted).toEqual(authActions.sessionValidationFailed({ reason: 'expired' }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call reloadSession and map to sessionValidationFailed with missing when http-status 401 and reason missing', async () => {
            httpServiceMock.reloadSession.mockReturnValue(throwError(() => httpUnauthorizedMissingErrorResponse));

            action$.next(authActions.validateSession());
            const emitted = await firstValueFrom(effects.validateSession$);

            expect(emitted).toEqual(authActions.sessionValidationFailed({ reason: 'missing' }));
            expect(httpServiceMock.reloadSession).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
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
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
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
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('logOut$', async () => {
        it('should call logOut and map to loggedOut when success', async () => {
            httpServiceMock.logOut.mockReturnValue(() => of());
            action$.next(authActions.logOut());
            const emmited = await firstValueFrom(effects.logOut$);

            expect(emmited).toEqual(authActions.loggedOut());
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call logOut and map to loggedOut when httpError', async () => {
            httpServiceMock.logOut.mockReturnValue(throwError(() => httpServerErrorResponse));
            action$.next(authActions.logOut());
            const emmited = await firstValueFrom(effects.logOut$);

            expect(emmited).toEqual(authActions.loggedOut());
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call logOut and map to loggedOut when Error', async () => {
            httpServiceMock.logOut.mockReturnValue(throwError(() => new Error('boom!')));
            action$.next(authActions.logOut());
            const emmited = await firstValueFrom(effects.logOut$);

            expect(emmited).toEqual(authActions.loggedOut());
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('loggedOut$', () => {
        it('should navigate to home', async () => {
            action$.next(authActions.loggedOut());
            await firstValueFrom(effects.loggedOut$);

            expect(httpServiceMock.createSession).not.toHaveBeenCalled();
            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.getSignupUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.reloadSession).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishWarning).not.toHaveBeenCalled();
            expect(messagePublisherMock.publishInfo).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });
});
