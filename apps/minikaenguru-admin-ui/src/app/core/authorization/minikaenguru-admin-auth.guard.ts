import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { map, take } from 'rxjs';

/**
 *
 * @returns true or a navigation
 */
export const minikaenguruAdminAuthGuard = (): CanActivateFn => () => {
    const auth = inject(AuthSessionFacade);
    const router = inject(Router);

    return auth.user$.pipe(
        take(1),
        map(user =>
            !user.anonym && user.berechtigungen.indexOf('ADMIN') >= 0 ? true : router.createUrlTree(['/', ''])
        )
    );
};
