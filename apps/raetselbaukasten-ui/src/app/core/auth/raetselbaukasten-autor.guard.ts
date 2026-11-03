import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { filter, map, of, switchMap, take } from 'rxjs';
import { isAdminOrAutor } from './raetselbaukasten-berechtigung.utils';
import { portalRoutes } from '@matheportal/portal-navigation';

export const raetselbaukastenAutorGuard = (): CanActivateFn => () => {
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

            if (user.anonym) {
                return router.createUrlTree([
                    '/',
                    portalRoutes.raetselbaukasten.root,
                    portalRoutes.raetselbaukasten.guests,
                ]);
            }

            return isAdminOrAutor(user)
                ? true
                : router.createUrlTree([
                      '/',
                      portalRoutes.raetselbaukasten.root,
                      portalRoutes.raetselbaukasten.dashboard,
                  ]);
        })
    );
};
