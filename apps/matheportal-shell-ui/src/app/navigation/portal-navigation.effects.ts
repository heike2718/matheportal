import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { sessionValidationFailed, userLoggedOut } from '@matheportal/auth-api';
import { portalRoutes } from '@matheportal/portal-navigation';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';

@Injectable()
export class PortalNavigationEffects {
    #actions = inject(Actions);
    #router = inject(Router);

    sessionValidationFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(sessionValidationFailed),
                tap(() => {
                    // void ignoriert das Promise vom router. Dann hängt es bei einem error nicht blöd in der Gegend herum.
                    void this.#router.navigate(['/', portalRoutes.home]);
                })
            ),
        { dispatch: false }
    );

    userLoggedOut$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(userLoggedOut),
                tap(() => {
                    // void ignoriert das Promise vom router. Dann hängt es nicht blöd in der Gegend herum.
                    void this.#router.navigateByUrl('/home');
                })
            ),
        { dispatch: false }
    );
}
