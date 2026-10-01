import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, of, switchMap, take } from 'rxjs';
import { MkaAuthorizationFacade } from './mka-authorization.facade';
import { portalRoutes } from '@matheportal/portal-navigation';

export const mkaLehrpersonGuard = (): CanActivateFn => () => {
    const auth = inject(MkaAuthorizationFacade);
    const router = inject(Router);

    return auth.authorizationLoadState$.pipe(
        filter(sessionState => sessionState !== 'not-loaded'),
        take(1),
        switchMap(sessionState => {
            if (sessionState !== 'loaded') {
                return of(router.createUrlTree(['/', portalRoutes.home]));
            }

            auth.ensureAuthorizationLoaded();

            return auth.authorizationLoadState$.pipe(
                filter(authorizationState => authorizationState !== 'not-loaded'),
                take(1),
                map(authorizationState =>
                    authorizationState === 'loaded' && auth.isLehrperson()
                        ? true
                        : router.createUrlTree(['/', portalRoutes.minikaenguruAnwendung.root])
                )
            );
        })
    );
};
