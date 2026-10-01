import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SchuleFacade } from './schule.facade';
import { portalRoutes } from '@matheportal/portal-navigation';

export const mkaSchuleDashboardGuard = (): CanActivateFn => route => {
    const router = inject(Router);
    const facade = inject(SchuleFacade);

    const schulkuerzel = route.paramMap.get('schulkuerzel');

    if (!schulkuerzel) {
        return router.createUrlTree(['/', portalRoutes.home]);
    }

    return facade.dashboardVorbereiten(schulkuerzel);
};
