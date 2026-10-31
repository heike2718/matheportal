import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { filter, map, of, switchMap, take } from 'rxjs';
import { isAdminOrAutor } from './raetselbaukasten-berechtigung.utils';
import { portalRoutes } from '@matheportal/portal-navigation';

export const raetselbaukastenAutorGuard = (): CanActivateFn => () => {
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
                    isAdminOrAutor(user)
                        ? true
                        : router.createUrlTree([
                              '/',
                              portalRoutes.raetselbaukasten.root,
                              portalRoutes.raetselbaukasten.dashboard,
                          ])
                )
            );
        })
    );
};
