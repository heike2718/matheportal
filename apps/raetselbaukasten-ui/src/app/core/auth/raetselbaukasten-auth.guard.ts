import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { portalRoutes } from '@matheportal/portal-navigation';
import { filter, map, of, switchMap, take } from 'rxjs';

/**
 *
 * @returns true or a navigation
 */
export const raetselbaukastenAuthGuard = (): CanActivateFn => () => {
    const portalSessionFacade = inject(AuthSessionFacade);
    const router = inject(Router);

    return portalSessionFacade.sessionLoadState$.pipe(
        filter(sessionState => sessionState !== 'not-loaded'),
        take(1),
        switchMap(sessionState => {
            if (sessionState !== 'loaded') {
                return sessionState === 'technical-error'
                    ? of(
                          router.createUrlTree([
                              '/',
                              portalRoutes.raetselbaukasten.root,
                              portalRoutes.raetselbaukasten.ladefehler,
                          ])
                      )
                    : of(router.createUrlTree(['/', portalRoutes.home]));
            }

            return portalSessionFacade.user$.pipe(
                map(user =>
                    user.anonym
                        ? router.createUrlTree([
                              '/',
                              portalRoutes.raetselbaukasten.root,
                              portalRoutes.raetselbaukasten.guests,
                          ])
                        : true
                )
            );
        })
    );
};
