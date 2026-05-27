import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthHttpService } from '../auth-http.service';
import { authActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthUrlResponse, User } from '@matheportal/auth-model';
import { MessageService } from '@matheportal/feedback-api';
import { BrowserNavigationService } from '../browser-navigation.service';

@Injectable({
    providedIn: 'root',
})
export class AuthEffects {
    #actions = inject(Actions);
    #router = inject(Router);
    #authHttpService = inject(AuthHttpService);
    #messageService = inject(MessageService);
    #browserNavigationService = inject(BrowserNavigationService);

    requestLogInUrl$ = createEffect(() => {
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

    requestLoginUrlFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.requestLoginUrlFailed),
                tap(() => {
                    this.#messageService.publishError(
                        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
                    );
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

    createSessionFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.createSessionFailed),
                tap(() => {
                    this.#messageService.publishError(
                        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
                    );
                })
            ),
        { dispatch: false }
    );

    logOut$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.logOut),
            switchMap(() => this.#authHttpService.logOut()),
            map(() => authActions.loggedOut({ reason: 'useraction' })),
            catchError(() => of(authActions.loggedOut({ reason: 'useraction' })))
        );
    });

    sessionValidationFailed$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.sessionValidationFailed),
            switchMap(({ reason }) =>
                this.#authHttpService.logOut().pipe(
                    map(() => authActions.loggedOut({ reason })),
                    catchError(() => of(authActions.loggedOut({ reason })))
                )
            )
        );
    });

    loggedOut$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.loggedOut),
                tap(({ reason }) => {
                    switch (reason) {
                        case 'expired': {
                            this.#messageService.publishWarning(
                                'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
                            );
                            break;
                        }
                        case 'technical': {
                            this.#messageService.publishError(
                                'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
                            );
                            break;
                        }
                        case 'useraction':
                            break;
                    }

                    // ignoriert das Promise vom router. Dann hängt es bei einem error nicht blöd in der Gegend herum.
                    void this.#router.navigateByUrl('/home');
                })
            ),
        { dispatch: false }
    );
}
