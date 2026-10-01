import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { portalRoutes } from '@matheportal/portal-navigation';
import { filter, map, of, switchMap, take } from 'rxjs';

/**
 *
 * @returns true or a navigation
 */
export const minikaenguruAdminGuard = (): CanActivateFn => () => {
    const portalSessionFacade = inject(AuthSessionFacade);
    const router = inject(Router);

    return portalSessionFacade.sessionLoadingState$.pipe(
        filter(sessionState => sessionState !== 'not-loaded'),
        take(1),
        switchMap(sessionState => {
            if (sessionState !== 'loaded') {
                return of(router.createUrlTree(['/', portalRoutes.home]));
            }

            return portalSessionFacade.user$.pipe(
                take(1),
                map(user =>
                    user.berechtigungen.indexOf('ADMIN') >= 0 ? true : router.createUrlTree(['/', portalRoutes.home])
                )
            );
        })
    );
};
