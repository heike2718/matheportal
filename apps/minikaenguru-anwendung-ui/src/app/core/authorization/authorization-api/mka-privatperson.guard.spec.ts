import {
    ActivatedRouteSnapshot,
    GuardResult,
    MaybeAsync,
    provideRouter,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { BehaviorSubject, firstValueFrom, isObservable, Observable } from 'rxjs';
import { AuthorizationLoadState } from '../authorization-model';
import { TestBed } from '@angular/core/testing';
import { MkaAuthorizationFacade } from './mka-authorization.facade';
import { mkaPrivatpersonGuard } from './mka-privatperson.guard';
import { signal, WritableSignal } from '@angular/core';

// TODO: Bei Einführung von Child-Routes unter dashboard-privatperson zusätzliche Tests für die child routes
// - Privatperson darf Child-Route aktivieren
// - Lehrperson wird blockiert/umgeleitet
// - anonymer User wird blockiert/umgeleitet

describe('mkaPrivatpersonGuard tests', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let authLoadStateSubject: BehaviorSubject<AuthorizationLoadState>;

    let mkaAuthFacadeMock: {
        authorizationLoadState$: Observable<AuthorizationLoadState>;
        isPrivatperson: WritableSignal<boolean>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(authLoadState: AuthorizationLoadState, isPrivatperson: boolean) {
        authLoadStateSubject = new BehaviorSubject<AuthorizationLoadState>(authLoadState);

        mkaAuthFacadeMock = {
            authorizationLoadState$: authLoadStateSubject.asObservable(),
            isPrivatperson: signal(isPrivatperson),
        };

        TestBed.configureTestingModule({
            providers: [provideRouter([]), { provide: MkaAuthorizationFacade, useValue: mkaAuthFacadeMock }],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should redirect users to minikaenguru start when not-loaded', async () => {
        const { router } = setup('not-loaded', false);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung');
    });

    it('should redirect users to minikaenguru start when failed', async () => {
        const { router } = setup('failed', false);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung');
    });

    it('should redirect users to minikaenguru start when loaded but not privatperson', async () => {
        const { router } = setup('loaded', false);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung');
    });

    it('should allow access for privatperson', async () => {
        setup('loaded', true);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(result).toBeTruthy();
    });
});
