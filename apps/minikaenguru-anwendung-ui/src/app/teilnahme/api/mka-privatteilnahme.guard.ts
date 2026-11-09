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
        map(loadState =>
            loadState === 'loaded'
                ? true
                : router.createUrlTree([
                      '/',
                      portalRoutes.minikaenguruAnwendung.root,
                      portalRoutes.minikaenguruAnwendung.privatperson,
                  ])
        )
    );
};
