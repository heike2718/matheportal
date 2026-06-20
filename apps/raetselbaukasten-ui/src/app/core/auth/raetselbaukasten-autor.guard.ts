import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { map, take } from 'rxjs';
import { isAdminOrAutor } from './raetselbaukasten-berechtigung.utils';

export const raetselbaukastenAutorGuard = (): CanActivateFn => () => {
    const auth = inject(AuthSessionFacade);
    const router = inject(Router);

    return auth.user$.pipe(
        take(1),
        map(user => (isAdminOrAutor(user) ? true : router.createUrlTree(['/', 'raetselbaukasten'])))
    );
};
