import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, of, switchMap, take } from 'rxjs';
import { MkaAuthorizationFacade } from '../../../core/authorization/authorization-api/mka-authorization.facade';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { MINIKAENGURU_BERECHTIGUNGSTYP } from '../../../core/authorization/authorization-model';
import { portalRoutes } from '@matheportal/portal-navigation';

export const mkaSchulkatalogsucheGuard = (): CanActivateFn => () => {
    const portalSessionFacade = inject(PortalSessionFacade);
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
                filter(mkaLoadState => mkaLoadState !== 'not-loaded'),
                take(1),
                map(authLoadState => {
                    if (authLoadState === 'failed') {
                        return router.createUrlTree([
                            '/',
                            portalRoutes.minikaenguruAnwendung.root,
                            portalRoutes.minikaenguruAnwendung.ladefehler,
                        ]);
                    } else {
                        const berechtigungstyp = mkaAuthFacade.berechtigungstyp();

                        if (
                            berechtigungstyp === MINIKAENGURU_BERECHTIGUNGSTYP.none ||
                            berechtigungstyp === MINIKAENGURU_BERECHTIGUNGSTYP.schule
                        ) {
                            return true;
                        }

                        return router.createUrlTree([
                            '/',
                            portalRoutes.minikaenguruAnwendung.root,
                            portalRoutes.minikaenguruAnwendung.privatperson,
                        ]);
                    }
                })
            );
        })
    );
};
