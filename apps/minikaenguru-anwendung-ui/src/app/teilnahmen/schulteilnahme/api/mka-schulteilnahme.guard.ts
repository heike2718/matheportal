import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { portalRoutes } from '@matheportal/portal-navigation';
import { SchulteilnahmeFacade } from './schulteilnahme.facade';

export const mkaSchulteilnahmeGuard = (): CanActivateFn => route => {
    const teilnahmeFacade = inject(SchulteilnahmeFacade);
    const router = inject(Router);

    const schulkuerzel = route.paramMap.get('schulkuerzel');

    if (!schulkuerzel) {
        // dieser Fall tritt nie ein, da der mkaSchuleGuard in diesem Fall bereits nach portal.home navigiert.
        // nur der compiler will zufriedengestellt werden.
        return router.createUrlTree([
            '/',
            portalRoutes.minikaenguruAnwendung.root,
            portalRoutes.minikaenguruAnwendung.lehrperson,
        ]);
    }

    teilnahmeFacade.aktuelleSchulteilnahmeVorbereiten(schulkuerzel);

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
                          portalRoutes.minikaenguruAnwendung.lehrperson,
                          'schule',
                          schulkuerzel,
                      ]);
            }
        })
    );
};
