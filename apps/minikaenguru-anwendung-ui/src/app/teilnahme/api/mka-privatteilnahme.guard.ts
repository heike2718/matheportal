import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { portalRoutes } from '@matheportal/portal-navigation';
import { TeilnahmeFacade } from './teilnahme.facade';

export const mkaPrivatteilnahmeGuard = (): CanActivateFn => () => {
    const teilnahmeFacade = inject(TeilnahmeFacade);
    const router = inject(Router);

    teilnahmeFacade.aktuellePrivatteilnahmeVorbereiten();

    return teilnahmeFacade.teilnahmeLoadState$.pipe(
        filter(loadState => loadState !== 'not-loaded'),
        take(1),
        map(loadState => {
            if (loadState === 'loaded') {
                return true;
            } else {
                return loadState === 'technical-error'
                    ? router.createUrlTree([
                          '/',
                          portalRoutes.minikaenguruAnwendung.root,
                          portalRoutes.minikaenguruAnwendung.ladefehler,
                      ])
                    : router.createUrlTree([
                          '/',
                          portalRoutes.minikaenguruAnwendung.root,
                          portalRoutes.minikaenguruAnwendung.privatperson,
                      ]);
            }
        })
    );
};
