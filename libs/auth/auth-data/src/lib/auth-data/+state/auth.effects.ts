import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthHttpService } from '../auth-http.service';
import { authActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthUrlResponse, LOCATION_HASH_SERVICE, User } from '@matheportal/auth-model';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { BrowserNavigationService } from '../browser-navigation.service';
import { mapHttpErrorToSessionValidationFailedReason } from '../session-validation-error.mapper';
import { TECHNISCHER_FEHLER_MESSAGE } from '@matheportal/shared-utils';
import { SESSION_VALIDATION_FAILED_REASON } from '../auth-data.utils';

@Injectable({
    providedIn: 'root',
})
export class AuthEffects {
    #actions = inject(Actions);
    #router = inject(Router);
    #authHttpService = inject(AuthHttpService);
    #browserNavigationService = inject(BrowserNavigationService);
    #locationHashService = inject(LOCATION_HASH_SERVICE);
    #messagePublisher = inject(MESSAGE_PUBLISHER);

    requestLoginUrl$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.requestLoginUrl),
            switchMap(() =>
                this.#authHttpService.getLoginUrl().pipe(
                    map((urlResponse: AuthUrlResponse) => authActions.redirectToIam({ iamUrl: urlResponse.url })),
                    catchError(() => of(authActions.requestLoginUrlFailed()))
                )
            )
        );
    });

    requestLoginUrlFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.requestLoginUrlFailed),
                tap(() => {
                    this.#messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
                })
            ),
        { dispatch: false }
    );

    requestSignupUrl$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.requestSignupUrl),
            switchMap(() =>
                this.#authHttpService.getSignupUrl().pipe(
                    map((urlResponse: AuthUrlResponse) => authActions.redirectToIam({ iamUrl: urlResponse.url })),
                    catchError(() => of(authActions.requestSignupUrlFailed()))
                )
            )
        );
    });

    requestSignupUrlFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.requestSignupUrlFailed),
                tap(() => {
                    this.#messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
                })
            ),
        { dispatch: false }
    );

    signedUp$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.signedUp),
                tap(() => {
                    this.#messagePublisher.publishInfo(
                        'Ihr Benutzerkonto wurde erfolgreich angelegt. Bevor Sie sich einloggen, muss es noch aktiviert werden. Bitte prüfen Sie Ihre Mail.'
                    );
                })
            ),
        { dispatch: false }
    );

    redirectToIam$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.redirectToIam),
                tap(({ iamUrl }) => {
                    this.#browserNavigationService.redirectToUrl(iamUrl);
                })
            ),
        { dispatch: false }
    );

    createSession$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.createSession),
            switchMap(({ idToken }) => this.#authHttpService.createSession(idToken)),
            map((user: User) => authActions.sessionCreated({ user })),
            catchError(() => of(authActions.createSessionFailed()))
        );
    });

    clearAuthCallbackHash$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(
                    authActions.sessionCreated,
                    authActions.createSessionFailed,
                    authActions.invalidOAuthFlowHash,
                    authActions.signedUp
                ),
                tap(() => this.#locationHashService.clear())
            ),
        { dispatch: false }
    );

    createSessionFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.createSessionFailed),
                tap(() => {
                    this.#messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
                })
            ),
        { dispatch: false }
    );

    invalidOAuthFlowHash$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.invalidOAuthFlowHash),
                tap(() => {
                    this.#messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
                })
            ),
        { dispatch: false }
    );

    logOut$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.logOut),
            switchMap(() => this.#authHttpService.logOut()),
            map(() => authActions.loggedOut()),
            catchError(() => of(authActions.loggedOut()))
        );
    });

    validateSession$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.validateSession),
            switchMap(() =>
                this.#authHttpService.reloadSession().pipe(
                    map((user: User) => authActions.sessionValidated({ user })),
                    catchError((error: unknown) => {
                        if (error instanceof HttpErrorResponse) {
                            const reason: SESSION_VALIDATION_FAILED_REASON =
                                mapHttpErrorToSessionValidationFailedReason(error);
                            return of(
                                authActions.sessionValidationFailed({
                                    reason: reason,
                                })
                            );
                        }

                        return of(authActions.sessionValidationFailed({ reason: 'technical' }));
                    })
                )
            )
        );
    });

    sessionValidationFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.sessionValidationFailed),
                tap(({ reason }) => {
                    switch (reason) {
                        case 'expired': {
                            this.#messagePublisher.publishWarning(
                                'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
                            );
                            // void ignoriert das Promise vom router. Dann hängt es bei einem error nicht blöd in der Gegend herum.
                            void this.#router.navigateByUrl('/home');
                            break;
                        }
                        case 'missing':
                            break;
                        case 'technical': {
                            this.#messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
                            // void ignoriert das Promise vom router. Dann hängt es bei einem error nicht blöd in der Gegend herum.
                            void this.#router.navigateByUrl('/home');
                            break;
                        }
                    }
                })
            ),
        { dispatch: false }
    );

    loggedOut$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.loggedOut),
                tap(() => {
                    // void ignoriert das Promise vom router. Dann hängt es nicht blöd in der Gegend herum.
                    void this.#router.navigateByUrl('/home');
                })
            ),
        { dispatch: false }
    );
}
