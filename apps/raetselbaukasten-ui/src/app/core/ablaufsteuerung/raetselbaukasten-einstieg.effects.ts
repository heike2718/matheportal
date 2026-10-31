import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RaetselbaukastenEinstiegActions } from './raetselbaukasten-einstieg.actions';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { filter, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { portalRoutes } from '@matheportal/portal-navigation';

@Injectable()
export class RaetselbaukastenEinstiegEffects {
    #actions = inject(Actions);
    #authSessionFacade = inject(AuthSessionFacade);
    #router = inject(Router);

    readonly navigateOnRootEinstiegRequested$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(RaetselbaukastenEinstiegActions.rootEinstiegRequested),
                switchMap(() =>
                    this.#authSessionFacade.sessionLoadState$.pipe(
                        filter(loadState => loadState !== 'not-loaded'),
                        take(1),
                        filter(loadState => loadState === 'loaded'),
                        withLatestFrom(this.#authSessionFacade.user$),
                        tap(([, user]) => {
                            if (user.anonym) {
                                this.#router.navigate([
                                    '/',
                                    portalRoutes.raetselbaukasten.root,
                                    portalRoutes.raetselbaukasten.guests,
                                ]);
                            } else {
                                this.#router.navigate([
                                    '/',
                                    portalRoutes.raetselbaukasten.root,
                                    portalRoutes.raetselbaukasten.dashboard,
                                ]);
                            }
                        })
                    )
                )
            );
        },
        { dispatch: false }
    );
}
