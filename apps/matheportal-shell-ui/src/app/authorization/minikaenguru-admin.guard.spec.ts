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
import { BehaviorSubject, firstValueFrom, isObservable, Observable, Subject } from 'rxjs';
import { minikaenguruAdminGuard } from './minikaenguru-admin.guard';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

describe('matheportalShellAdminAuthGuard tests', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let sessionLoadStateSubject: Subject<RESOURCE_LOAD_STATE>;
    let userSubject: Subject<User>;

    let authSessionFacadeMock: {
        sessionLoadState$: Observable<RESOURCE_LOAD_STATE>;
        user$: Observable<User>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(sessionLoadState: RESOURCE_LOAD_STATE, user: User) {
        sessionLoadStateSubject = new BehaviorSubject<RESOURCE_LOAD_STATE>(sessionLoadState);
        userSubject = new BehaviorSubject<User>(user);

        authSessionFacadeMock = {
            sessionLoadState$: sessionLoadStateSubject.asObservable(),
            user$: userSubject.asObservable(),
        };

        TestBed.configureTestingModule({
            providers: [provideRouter([]), { provide: AuthSessionFacade, useValue: authSessionFacadeMock }],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should allow access when authorization arrives later', async () => {
        setup('not-loaded', anonymousUser);

        const user: User = {
            anonym: false,
            berechtigungen: ['ADMIN'],
            fullName: 'Ruth',
        };

        const resultPromise = TestBed.runInInjectionContext(() =>
            resolveGuardResult(minikaenguruAdminGuard()(route, state))
        );

        // Zuerst die User setzen, dann die Autorisierung abschließen.
        userSubject.next(user);
        sessionLoadStateSubject.next('loaded');

        const result = await resultPromise;

        expect(result).toBe(true);
    });

    it('`should wait for session initialization before allowing access`', () => {
        setup('not-loaded', anonymousUser);

        const user: User = {
            anonym: false,
            berechtigungen: ['ADMIN'],
            fullName: 'Ruth',
        };

        const guardResult = TestBed.runInInjectionContext(() => minikaenguruAdminGuard()(route, state));

        if (!isObservable(guardResult)) {
            throw new Error('Expected guard to return an Observable');
        }

        const emittedResults: GuardResult[] = [];
        const onComplete = vi.fn();

        const subscription = guardResult.subscribe({
            next: result => emittedResults.push(result),
            complete: onComplete,
        });

        try {
            expect(emittedResults).toEqual([]);
            expect(onComplete).not.toHaveBeenCalled();

            // Die getrennten Mocks bilden den gemeinsamen Store-Übergang nach:
            // Der User muss beim Bekanntgeben von loaded bereits verfügbar sein.
            userSubject.next(user);

            expect(emittedResults).toEqual([]);
            expect(onComplete).not.toHaveBeenCalled();

            sessionLoadStateSubject.next('loaded');

            expect(emittedResults).toEqual([true]);
            expect(onComplete).toHaveBeenCalledOnce();
            expect(subscription.closed).toBe(true);
        } finally {
            subscription.unsubscribe();
        }
    });

    it('should redirect users to the portal home when not logged in', async () => {
        const { router } = setup('unauthorized', anonymousUser);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(minikaenguruAdminGuard()(route, state))
        );

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/home');
    });

    it('should redirect users to the portal home logged in and have empty berechtigungen', async () => {
        const user: User = {
            anonym: false,
            berechtigungen: [],
            fullName: 'Amy',
        };
        const { router } = setup('loaded', user);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(minikaenguruAdminGuard()(route, state))
        );

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/home');
    });

    it.each(['STANDARD', 'AUTOR', 'SCHULE', 'PRIVAT', 'KL_ADMIN'])(
        'should redirect users to the portal home when logged in and $berechtigung',
        async berechtigung => {
            const berechtigungen = [];
            berechtigungen.push(berechtigung);

            const user: User = {
                anonym: false,
                berechtigungen: berechtigungen,
                fullName: 'Amy',
            };
            const { router } = setup('loaded', user);

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
        setup('loaded', user);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(minikaenguruAdminGuard()(route, state))
        );

        expect(result).toBeTruthy();
    });
});
