import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RaetselbaukastenEinstiegActions } from './raetselbaukasten-einstieg.actions';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { filter, switchMap, take, tap } from 'rxjs';
import { portalRoutes } from '@matheportal/portal-navigation';

@Injectable()
export class RaetselbaukastenEinstiegEffects {
    #actions = inject(Actions);
    #portalSessionFacade = inject(PortalSessionFacade);
    #router = inject(Router);

    readonly navigateOnRootEinstiegRequested$ = createEffect(
        () => {
            return this.#actions.pipe(
                ofType(RaetselbaukastenEinstiegActions.rootEinstiegRequested),
                switchMap(() =>
                    this.#portalSessionFacade.portalSession$.pipe(
                        filter(portalSession => portalSession.sessionLoadState !== 'not-loaded'),
                        take(1),
                        filter(portalSession => portalSession.sessionLoadState === 'loaded'),
                        tap(portalSession => {
                            if (portalSession.user.anonym) {
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
