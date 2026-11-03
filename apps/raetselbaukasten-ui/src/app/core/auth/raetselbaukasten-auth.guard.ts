import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { portalRoutes } from '@matheportal/portal-navigation';
import { filter, map, take } from 'rxjs';

/**
 *
 * @returns true or a navigation
 */
export const raetselbaukastenAuthGuard = (): CanActivateFn => () => {
    const portalSessionFacade = inject(PortalSessionFacade);
    const router = inject(Router);

    return portalSessionFacade.portalSession$.pipe(
        filter(session => session.sessionLoadState !== 'not-loaded'),
        take(1),
        map(({ user, sessionLoadState }) => {
            if (sessionLoadState === 'technical-error') {
                return router.createUrlTree([
                    '/',
                    portalRoutes.raetselbaukasten.root,
                    portalRoutes.raetselbaukasten.ladefehler,
                ]);
            }

            return user.anonym
                ? router.createUrlTree(['/', portalRoutes.raetselbaukasten.root, portalRoutes.raetselbaukasten.guests])
                : true;
        })
    );
};
