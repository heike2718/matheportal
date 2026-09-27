import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { MkaAuthorizationFacade } from './mka-authorization.facade';

export const mkaLehrpersonGuard = (): CanActivateFn => () => {
    const auth = inject(MkaAuthorizationFacade);
    const router = inject(Router);

    return auth.authorizationLoadState$.pipe(
        take(1),
        map(state =>
            state === 'loaded' && auth.isLehrperson() ? true : router.createUrlTree(['/', 'minikaenguru-anwendung'])
        )
    );
};
