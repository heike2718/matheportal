import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of, throwError, firstValueFrom, take } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { provideStore } from '@ngrx/store';
import { AuthHttpService } from '../auth-http.service';
import { Router } from '@angular/router';
import { MessageService } from '@matheportal/feedback-api';
import { authActions } from './auth.actions';
import { AuthUrlResponse, SESSION_VALIDATION_FAILED_REASON } from '@matheportal/auth-model';
import { HttpErrorResponse } from '@angular/common/http';
import { BrowserNavigationService } from '../browser-navigation.service';

describe('AuthEffects', () => {
    let action$: ReplaySubject<unknown>;
    let effects: AuthEffects;

    const httpErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/authurls/login',
    });

    const httpServiceMock = {
        getLoginUrl: vi.fn(),
        logOut: vi.fn(),
    };

    const messageServiceMock = {
        publishError: vi.fn(),
        publishWarning: vi.fn(),
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
                { provide: MessageService, useValue: messageServiceMock },
                { provide: BrowserNavigationService, useValue: browserNavigationServiceMock },
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

            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messageServiceMock.publishError).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call AuthHttpService and map to requestLoginUrlFailed when HttpErrorResponse', async () => {
            httpServiceMock.getLoginUrl.mockReturnValue(throwError(() => httpErrorResponse));

            action$.next(authActions.requestLoginUrl());
            const emitted = await firstValueFrom(effects.requestLogInUrl$);
            expect(emitted).toEqual(authActions.requestLoginUrlFailed());
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messageServiceMock.publishError).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call AuthHttpService and map to requestLoginUrlFailed when other Error', async () => {
            httpServiceMock.getLoginUrl.mockReturnValue(throwError(() => new Error('boom')));

            action$.next(authActions.requestLoginUrl());
            const emitted = await firstValueFrom(effects.requestLogInUrl$);
            expect(emitted).toEqual(authActions.requestLoginUrlFailed());
            expect(httpServiceMock.getLoginUrl).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messageServiceMock.publishError).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
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

            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messageServiceMock.publishError).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
        });
    });

    describe('requestLoginUrlFailed$', () => {
        it('should publish an error message', async () => {
            action$.next(authActions.requestLoginUrlFailed());

            await firstValueFrom(effects.requestLoginUrlFailed$);

            expect(messageServiceMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
            );

            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('logOut$', () => {
        it('should call logOut and map to loggedOut', async () => {
            httpServiceMock.logOut.mockReturnValue(of(undefined));

            action$.next(authActions.logOut());

            const emitted = await firstValueFrom(effects.logOut$);

            expect(emitted).toEqual(authActions.loggedOut({ reason: 'useraction' }));
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(messageServiceMock.publishError).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call logOut and map to loggedOut, when HttpErrorResponse', async () => {
            httpServiceMock.logOut.mockReturnValue(throwError(() => httpErrorResponse));

            action$.next(authActions.logOut());

            const emitted = await firstValueFrom(effects.logOut$);

            expect(emitted).toEqual(authActions.loggedOut({ reason: 'useraction' }));
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(messageServiceMock.publishError).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should call logOut and map to loggedOut, when general Error', async () => {
            httpServiceMock.logOut.mockReturnValue(throwError(() => new Error('boom!')));

            action$.next(authActions.logOut());

            const emitted = await firstValueFrom(effects.logOut$);

            expect(emitted).toEqual(authActions.loggedOut({ reason: 'useraction' }));
            expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(messageServiceMock.publishError).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });

    describe('sessionValidationFailed$', () => {
        it.each<SESSION_VALIDATION_FAILED_REASON>(['technical', 'expired'])(
            'should call logOut and map to loggedOut',
            async reason => {
                httpServiceMock.logOut.mockReturnValue(of(undefined));
                action$.next(authActions.sessionValidationFailed({ reason: reason }));
                const emitted = await firstValueFrom(effects.sessionValidationFailed$);

                expect(emitted).toEqual(authActions.loggedOut({ reason: reason }));
                expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

                expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
                expect(messageServiceMock.publishError).not.toHaveBeenCalled();
                expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
                expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
                expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
            }
        );

        it.each<SESSION_VALIDATION_FAILED_REASON>(['technical', 'expired'])(
            'should call logOut and map to loggedOut when HttpErrorResponse',
            async reason => {
                httpServiceMock.logOut.mockReturnValue(throwError(() => httpErrorResponse));
                action$.next(authActions.sessionValidationFailed({ reason: reason }));
                const emitted = await firstValueFrom(effects.sessionValidationFailed$);

                expect(emitted).toEqual(authActions.loggedOut({ reason: reason }));
                expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

                expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
                expect(messageServiceMock.publishError).not.toHaveBeenCalled();
                expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
                expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
                expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
            }
        );

        it.each<SESSION_VALIDATION_FAILED_REASON>(['technical', 'expired'])(
            'should call logOut and map to loggedOut when general Error',
            async reason => {
                httpServiceMock.logOut.mockReturnValue(throwError(() => new Error('boom!')));
                action$.next(authActions.sessionValidationFailed({ reason: reason }));
                const emitted = await firstValueFrom(effects.sessionValidationFailed$);

                expect(emitted).toEqual(authActions.loggedOut({ reason: reason }));
                expect(httpServiceMock.logOut).toHaveBeenCalledTimes(1);

                expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
                expect(messageServiceMock.publishError).not.toHaveBeenCalled();
                expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
                expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
                expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
            }
        );
    });

    describe('loggedOut$', () => {
        it('should publishWarning and route to home when reason expired', async () => {
            action$.next(authActions.loggedOut({ reason: 'expired' }));
            await firstValueFrom(effects.loggedOut$);

            expect(messageServiceMock.publishWarning).toHaveBeenCalledWith(
                'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
            );
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');

            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messageServiceMock.publishError).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should publishError and route to home when reason technical', async () => {
            action$.next(authActions.loggedOut({ reason: 'technical' }));
            await firstValueFrom(effects.loggedOut$);

            expect(messageServiceMock.publishError).toHaveBeenCalledWith(
                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
            );
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');

            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });

        it('should not publish any message and route to home when reason useraction', async () => {
            action$.next(authActions.loggedOut({ reason: 'useraction' }));
            await firstValueFrom(effects.loggedOut$);

            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');

            expect(httpServiceMock.getLoginUrl).not.toHaveBeenCalled();
            expect(httpServiceMock.logOut).not.toHaveBeenCalled();
            expect(messageServiceMock.publishError).not.toHaveBeenCalled();
            expect(messageServiceMock.publishWarning).not.toHaveBeenCalled();
            expect(browserNavigationServiceMock.redirectToUrl).not.toHaveBeenCalled();
        });
    });
});
