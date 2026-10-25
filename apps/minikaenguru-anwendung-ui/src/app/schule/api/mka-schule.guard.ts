import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SchuleFacade } from './schule.facade';
import { portalRoutes } from '@matheportal/portal-navigation';
import { combineLatest, filter, map, take } from 'rxjs';
import { WettbewerbFacade } from '../../core/wettbewerb/api/wettbewerb.facade';
import { Store } from '@ngrx/store';
import { schulenLadenVerweigert } from '../../lehrperson/api/public-lehrperson.selectors';

export const mkaSchuleGuard = (): CanActivateFn => route => {
    const router = inject(Router);
    const schuleFacade = inject(SchuleFacade);
    const wettbewerbFacade = inject(WettbewerbFacade);
    const store = inject(Store);

    const schulenLadenVerweigertSignal = store.selectSignal(schulenLadenVerweigert);

    const schulkuerzel = route.paramMap.get('schulkuerzel');

    if (!schulkuerzel || schulenLadenVerweigertSignal()) {
        return router.createUrlTree(['/', portalRoutes.home]);
    }

    schuleFacade.dashboardVorbereiten(schulkuerzel);
    wettbewerbFacade.ensureWettbewerbGeladen();

    return combineLatest([schuleFacade.wettbewerbskontextLoadState$, wettbewerbFacade.wettbewerbLoadState$]).pipe(
        filter(([kontextState, wettbewerbState]) => {
            const beideGeladen = kontextState === 'loaded' && wettbewerbState === 'loaded';
            const kontextFehlgeschlagen = kontextState !== 'not-loaded' && kontextState !== 'loaded';
            const wettbewerbFehlgeschlagen = wettbewerbState !== 'not-loaded' && wettbewerbState !== 'loaded';
            return beideGeladen || kontextFehlgeschlagen || wettbewerbFehlgeschlagen;
        }),
        take(1),
        map(([wettbewerbskontextLoadState, wettbewerbLoadState]) => {
            if (wettbewerbLoadState === 'loaded' && wettbewerbskontextLoadState === 'loaded') {
                return true;
            }
            if (wettbewerbLoadState === 'technical-error' || wettbewerbskontextLoadState === 'technical-error') {
                return router.createUrlTree([
                    '/',
                    portalRoutes.minikaenguruAnwendung.root,
                    portalRoutes.minikaenguruAnwendung.ladefehler,
                ]);
            }
            return router.createUrlTree([
                '/',
                portalRoutes.minikaenguruAnwendung.root,
                portalRoutes.minikaenguruAnwendung.lehrperson,
            ]);
        })
    );
};
