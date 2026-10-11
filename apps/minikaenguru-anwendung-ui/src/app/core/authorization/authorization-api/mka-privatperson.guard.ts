import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, of, switchMap, take } from 'rxjs';
import { MkaAuthorizationFacade } from './mka-authorization.facade';
import { portalRoutes } from '@matheportal/portal-navigation';
import { AuthSessionFacade } from '@matheportal/auth-api';

export const mkaPrivatpersonGuard = (): CanActivateFn => () => {
    const portalSessionFacade = inject(AuthSessionFacade);
    const mkaAuthFacade = inject(MkaAuthorizationFacade);
    const router = inject(Router);

    return portalSessionFacade.sessionLoadState$.pipe(
        filter(sessionState => sessionState !== 'not-loaded'),
        take(1),
        switchMap(sessionState => {
            if (sessionState !== 'loaded') {
                return of(router.createUrlTree(['/', portalRoutes.home]));
            }

            mkaAuthFacade.ensureAuthorizationLoaded();

            return mkaAuthFacade.authorizationLoadState$.pipe(
                filter(authorizationState => authorizationState !== 'not-loaded'),
                take(1),
                map(authorizationState =>
                    authorizationState === 'loaded' && mkaAuthFacade.isPrivatperson()
                        ? true
                        : router.createUrlTree(['/', portalRoutes.minikaenguruAnwendung.root])
                )
            );
        })
    );
};
