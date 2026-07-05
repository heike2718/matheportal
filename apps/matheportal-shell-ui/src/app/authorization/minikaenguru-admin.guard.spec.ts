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
import { anonymousUser, User } from '@matheportal/auth-model';
import { BehaviorSubject, firstValueFrom, isObservable, Observable } from 'rxjs';
import { minikaenguruAdminGuard } from './minikaenguru-admin.guard';

describe('matheportalShellAdminAuthGuard tests', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let userSubject: BehaviorSubject<User>;

    let authSessionFacadeMock: {
        user$: Observable<User>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(user: User) {
        userSubject = new BehaviorSubject<User>(user);

        authSessionFacadeMock = {
            user$: userSubject.asObservable(),
        };

        TestBed.configureTestingModule({
            providers: [provideRouter([]), { provide: AuthSessionFacade, useValue: authSessionFacadeMock }],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should redirect users to the shell when not logged in', async () => {
        const { router } = setup(anonymousUser);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(minikaenguruAdminGuard()(route, state))
        );

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/home');
    });

    it('should redirect users to the shell when logged in and have empty berechtigungen', async () => {
        const user: User = {
            anonym: false,
            berechtigungen: [],
            fullName: 'Amy',
        };
        const { router } = setup(user);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(minikaenguruAdminGuard()(route, state))
        );

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/home');
    });

    it.each(['STANDARD', 'AUTOR', 'SCHULE', 'PRIVAT', 'KL_ADMIN'])(
        'should redirect users to the shell when logged in and $berechtigung',
        async berechtigung => {
            const berechtigungen = [];
            berechtigungen.push(berechtigung);

            const user: User = {
                anonym: false,
                berechtigungen: berechtigungen,
                fullName: 'Amy',
            };
            const { router } = setup(user);

            const result = await TestBed.runInInjectionContext(async () =>
                resolveGuardResult(minikaenguruAdminGuard()(route, state))
            );

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/home');
        }
    );

    it('should allow access for admin', async () => {
        const user: User = {
            anonym: false,
            berechtigungen: ['ADMIN'],
            fullName: 'Ruth',
        };
        setup(user);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(minikaenguruAdminGuard()(route, state))
        );

        expect(result).toBeTruthy();
    });
});
