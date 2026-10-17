import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest, filter, map, of, switchMap, take, tap } from 'rxjs';
import { portalRoutes } from '@matheportal/portal-navigation';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { PrivatpersonFacade } from './privatperson.facade';
import { WettbewerbFacade } from '../../core/wettbewerb/api/wettbewerb.facade';

export const mkaPrivatpersonGuard = (): CanActivateFn => () => {
    const portalSessionFacade = inject(AuthSessionFacade);
    const mkaAuthFacade = inject(MkaAuthorizationFacade);
    const router = inject(Router);
    const privatpersonFacade = inject(PrivatpersonFacade);
    const wettbewerbFacade = inject(WettbewerbFacade);

    return portalSessionFacade.sessionLoadState$.pipe(
        filter(sessionState => sessionState !== 'not-loaded'),
        take(1),
        switchMap(sessionState => {
            if (sessionState !== 'loaded') {
                return of(router.createUrlTree(['/', portalRoutes.home]));
            }

            mkaAuthFacade.ensureAuthorizationLoaded();
            wettbewerbFacade.ensureWettbewerbGeladen();
            privatpersonFacade.dashboardVorbereiten();

            return combineLatest([
                mkaAuthFacade.authorizationLoadState$,
                wettbewerbFacade.wettbewerbLoadState$,
                privatpersonFacade.wettbewerbskontextLoadState$,
            ]).pipe(
                filter(([authState, wettbewerbState, kontextState]) => {
                    const alleGeladen =
                        authState === 'loaded' && wettbewerbState === 'loaded' && kontextState === 'loaded';
                    const authFehlgeschlagen = authState !== 'not-loaded' && authState !== 'loaded';
                    const wettbewerbFehlgeschlagen = wettbewerbState !== 'not-loaded' && wettbewerbState !== 'loaded';
                    const kontextFehlgeschlagen = kontextState !== 'not-loaded' && kontextState !== 'loaded';
                    return alleGeladen || authFehlgeschlagen || wettbewerbFehlgeschlagen || kontextFehlgeschlagen;
                }),
                take(1),
                map(([authState, wettbewerbState, kontextState]) =>
                    authState === 'loaded' && wettbewerbState === 'loaded' && kontextState === 'loaded'
                        ? true
                        : router.createUrlTree([
                              '/',
                              portalRoutes.minikaenguruAnwendung,
                              portalRoutes.minikaenguruAnwendung.guests,
                          ])
                )
            );
        })
    );
};
