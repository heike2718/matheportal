import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthHttpService } from '../auth-http.service';
import { authActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthUrlResponse } from '@matheportal/auth-model';

@Injectable({
    providedIn: 'root',
})
export class AuthEffects {
    #store = inject(Store);
    #actions = inject(Actions);
    #router = inject(Router);
    #authHttpService = inject(AuthHttpService);

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
                switchMap(action => of(action.iamUrl)),
                tap(iamUrl => {
                    window.location.href = iamUrl;
                })
            ),
        { dispatch: false }
    );
}
