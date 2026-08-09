import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { sessionValidationFailed, userLoggedOut } from '@matheportal/auth-api';
import { MESSAGE_PUBLISHER } from '@matheportal/error-handling-api';
import { portalRoutes } from '@matheportal/portal-navigation';
import { SESSION_EXPIRED_MESSAGE, TECHNISCHER_FEHLER_MESSAGE } from '@matheportal/shared-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';

@Injectable()
export class PortalNavigationEffects {
    #actions = inject(Actions);
    #router = inject(Router);
    #messagePublisher = inject(MESSAGE_PUBLISHER);

    sessionValidationFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(sessionValidationFailed),
                tap(action => {
                    switch (action.reason) {
                        case 'technical':
                            this.#messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
                            break;
                        case 'missing':
                            break;
                        case 'expired':
                            this.#messagePublisher.publishWarning(SESSION_EXPIRED_MESSAGE);
                            break;
                    }
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
                    void this.#router.navigate(['/', portalRoutes.home]);
                })
            ),
        { dispatch: false }
    );
}
