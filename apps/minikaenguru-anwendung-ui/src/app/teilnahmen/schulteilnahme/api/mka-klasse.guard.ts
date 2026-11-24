import { CanActivateFn, Router } from '@angular/router';
import { SchulteilnahmeFacade } from './schulteilnahme.facade';
import { inject } from '@angular/core';
import { portalRoutes } from '@matheportal/portal-navigation';
import { filter, map, take } from 'rxjs';

export const mkaKlasseGuard = (): CanActivateFn => route => {
    const teilnahmeFacade = inject(SchulteilnahmeFacade);
    const router = inject(Router);

    const schulkuerzel = route.paramMap.get('schulkuerzel');
    const klasseId = route.paramMap.get('klasseId');

    if (!schulkuerzel) {
        // dieser Fall tritt nie ein, da der mkaSchuleGuard in diesem Fall bereits nach portal.home navigiert.
        // nur der compiler will zufriedengestellt werden.
        return router.createUrlTree([
            '/',
            portalRoutes.minikaenguruAnwendung.root,
            portalRoutes.minikaenguruAnwendung.lehrperson,
        ]);
    }

    if (!klasseId) {
        return router.createUrlTree([
            '/',
            portalRoutes.minikaenguruAnwendung.root,
            portalRoutes.minikaenguruAnwendung.lehrperson,
            'schule',
            schulkuerzel,
            portalRoutes.minikaenguruAnwendung.schulteilnahme,
        ]);
    }

    teilnahmeFacade.klassenLaden(schulkuerzel);

    return teilnahmeFacade.klassenLoadStateAndKlassen$.pipe(
        filter(({ klassenLoadState }) => klassenLoadState !== 'not-loaded'),
        take(1),
        map(({ klassenLoadState, klassen }) => {
            if (klassenLoadState === 'loaded') {
                const klasse = klassen.find(kl => klasseId === kl.uuid);

                if (klasse) {
                    teilnahmeFacade.klasseAusRouteErmittelt(klasse);
                    return true;
                } else {
                    return router.createUrlTree([
                        '/',
                        portalRoutes.minikaenguruAnwendung.root,
                        portalRoutes.minikaenguruAnwendung.lehrperson,
                        'schule',
                        schulkuerzel,
                        portalRoutes.minikaenguruAnwendung.schulteilnahme,
                    ]);
                }
            }

            switch (klassenLoadState) {
                case 'unauthorized':
                    return router.createUrlTree(['/', portalRoutes.home]);
                case 'technical-error':
                    return router.createUrlTree([
                        '/',
                        portalRoutes.minikaenguruAnwendung.root,
                        portalRoutes.minikaenguruAnwendung.ladefehler,
                    ]);
                default:
                    return router.createUrlTree([
                        '/',
                        portalRoutes.minikaenguruAnwendung.root,
                        portalRoutes.minikaenguruAnwendung.lehrperson,
                        'schule',
                        schulkuerzel,
                        portalRoutes.minikaenguruAnwendung.schulteilnahme,
                    ]);
            }
        })
    );
};
