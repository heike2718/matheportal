import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SchuleFacade } from './schule.facade';
import { portalRoutes } from '@matheportal/portal-navigation';
import { combineLatest, filter, forkJoin, map, take } from 'rxjs';
import { WettbewerbFacade } from '../../core/wettbewerb/api/wettbewerb.facade';

export const mkaSchuleGuard = (): CanActivateFn => route => {
    const router = inject(Router);
    const schuleFacade = inject(SchuleFacade);
    const wettbewerbFacade = inject(WettbewerbFacade);

    const schulkuerzel = route.paramMap.get('schulkuerzel');

    if (!schulkuerzel) {
        return router.createUrlTree(['/', portalRoutes.home]);
    }

    schuleFacade.dashboardVorbereiten(schulkuerzel);

    return combineLatest([schuleFacade.wettbewerbskontextLoadState$, wettbewerbFacade.wettbewerbLoadState$]).pipe(
        filter(([kontextState, wettbewerbState]) => {
            const beideGeladen = kontextState === 'loaded' && wettbewerbState === 'loaded';
            const kontextFehlgeschlagen = kontextState !== 'not-loaded' && kontextState !== 'loaded';
            const wettbewerbFehlgeschlagen = wettbewerbState !== 'not-loaded' && wettbewerbState !== 'loaded';
            return beideGeladen || kontextFehlgeschlagen || wettbewerbFehlgeschlagen;
        }),
        take(1),
        map(([wettbewerbskontextLoadState, wettbewerbLoadState]) =>
            wettbewerbskontextLoadState === 'loaded' && wettbewerbLoadState === 'loaded'
                ? true
                : router.createUrlTree([
                      '/',
                      portalRoutes.minikaenguruAnwendung.root,
                      portalRoutes.minikaenguruAnwendung.lehrperson,
                  ])
        )
    );
};
