import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SchuleFacade } from './schule.facade';
import { portalRoutes } from '@matheportal/portal-navigation';
import { filter, map, take } from 'rxjs';

export const mkaSchuleGuard = (): CanActivateFn => route => {
    const router = inject(Router);
    const facade = inject(SchuleFacade);

    const schulkuerzel = route.paramMap.get('schulkuerzel');

    if (!schulkuerzel) {
        return router.createUrlTree(['/', portalRoutes.home]);
    }

    facade.dashboardVorbereiten(schulkuerzel);

    return facade.wettbewerbskontextLoadingState$.pipe(
        filter(state => state !== 'not-loaded'),
        take(1),
        map(state =>
            state === 'loaded'
                ? true
                : router.createUrlTree([
                      '/',
                      portalRoutes.minikaenguruAnwendung.root,
                      portalRoutes.minikaenguruAnwendung.lehrperson,
                  ])
        )
    );
};
