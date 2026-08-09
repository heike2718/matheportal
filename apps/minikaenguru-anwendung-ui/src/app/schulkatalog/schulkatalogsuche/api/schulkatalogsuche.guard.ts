import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { MkaAuthorizationFacade } from '../../../core/authorization/authorization-api/mka-authorization.facade';

export const mkaSchulkatalogsucheGuard = (): CanActivateFn => () => {
    const auth = inject(MkaAuthorizationFacade);
    const router = inject(Router);

    return auth.authorizationLoadState$.pipe(
        take(1),
        map(state =>
            state === 'loaded' && auth.isPrivatperson() === false
                ? true
                : router.createUrlTree(['/', 'minikaenguru-anwendung'])
        )
    );
};
