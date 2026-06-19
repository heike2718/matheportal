import { TestBed } from '@angular/core/testing';
import {
    ActivatedRouteSnapshot,
    GuardResult,
    MaybeAsync,
    provideRouter,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { BehaviorSubject, firstValueFrom, isObservable, Observable, of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { raetselbaukastenAutorGuard } from './raetselbaukasten-autor.guard';
import { User } from '@matheportal/auth-model';

describe('raetselbaukastenAuthGuard', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let userSubject: BehaviorSubject<User>;

    const authSessionFacadeMock = {
        user$: undefined as unknown as Observable<User>,
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(rollen: string[], isAnonym: boolean, fullName: string) {
        const user: User = {
            anonym: isAnonym,
            fullName: fullName,
            berechtigungen: rollen,
        };

        userSubject = new BehaviorSubject<User>(user);
        authSessionFacadeMock.user$ = userSubject.asObservable();

        TestBed.configureTestingModule({
            providers: [provideRouter([]), { provide: AuthSessionFacade, useValue: authSessionFacadeMock }],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should redirect anonymous user to raetselbaukasten start page', async () => {
        const { router } = setup([], true, 'Gast');

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(raetselbaukastenAutorGuard()(route, state))
        );

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/raetselbaukasten');
    });

    it('should allow access for AUTOR', async () => {
        setup(['KL_ADMIN', 'AUTOR'], false, 'Frodo');

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(raetselbaukastenAutorGuard()(route, state))
        );

        expect(result).toBeTruthy();
    });

    it('should allow access for ADMIN', async () => {
        setup(['ADMIN', 'KL_ADMIN'], false, 'Checki');

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(raetselbaukastenAutorGuard()(route, state))
        );

        expect(result).toBeTruthy();
    });

    it('should allow access for loggedIn users without berechtigungen', async () => {
        setup([], false, 'Ada');

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(raetselbaukastenAutorGuard()(route, state))
        );

        expect(result).toBeTruthy();
    });

    it('should allow access for loggedIn users with authority STANDARD', async () => {
        setup(['STANDARD'], false, 'Bilbo');

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(raetselbaukastenAutorGuard()(route, state))
        );

        expect(result).toBeTruthy();
    });
});
