import {
    ActivatedRouteSnapshot,
    GuardResult,
    MaybeAsync,
    provideRouter,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { BehaviorSubject, firstValueFrom, isObservable, Observable, Subject } from 'rxjs';
import { AuthorizationLoadState } from '../authorization-model';
import { TestBed } from '@angular/core/testing';
import { MkaAuthorizationFacade } from './mka-authorization.facade';
import { mkaPrivatpersonGuard } from './mka-privatperson.guard';
import { signal, WritableSignal } from '@angular/core';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { AuthSessionFacade } from '@matheportal/auth-api';

// TODO: Bei Einführung von Child-Routes unter dashboard-privatperson zusätzliche Tests für die child routes
// - Privatperson darf Child-Route aktivieren
// - Lehrperson wird blockiert/umgeleitet
// - anonymer User wird blockiert/umgeleitet

describe('mkaPrivatpersonGuard tests', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let sessionLoadStateSubject: Subject<RESOURCE_LOAD_STATE>;
    let authLoadStateSubject: Subject<AuthorizationLoadState>;

    let mkaAuthFacadeMock: {
        authorizationLoadState$: Observable<AuthorizationLoadState>;
        isPrivatperson: WritableSignal<boolean>;
        ensureAuthorizationLoaded: ReturnType<typeof vi.fn>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(
        sessionLoadState: RESOURCE_LOAD_STATE,
        authLoadState: AuthorizationLoadState,
        isPrivatperson: boolean
    ) {
        sessionLoadStateSubject = new BehaviorSubject<RESOURCE_LOAD_STATE>(sessionLoadState);
        authLoadStateSubject = new BehaviorSubject<AuthorizationLoadState>(authLoadState);

        mkaAuthFacadeMock = {
            authorizationLoadState$: authLoadStateSubject.asObservable(),
            isPrivatperson: signal(isPrivatperson),
            ensureAuthorizationLoaded: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                {
                    provide: AuthSessionFacade,
                    useValue: {
                        sessionLoadState$: sessionLoadStateSubject.asObservable(),
                    },
                },
                { provide: MkaAuthorizationFacade, useValue: mkaAuthFacadeMock },
            ],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should allow access when authorization arrives later', async () => {
        setup('loaded', 'not-loaded', false);

        const resultPromise = TestBed.runInInjectionContext(() =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).toHaveBeenCalledOnce();

        // Zuerst die Berechtigung setzen, dann die Autorisierung abschließen.
        mkaAuthFacadeMock.isPrivatperson.set(true);
        authLoadStateSubject.next('loaded');

        const result = await resultPromise;

        expect(result).toBe(true);
    });

    it('should wait for session and authorization before allowing access', () => {
        setup('not-loaded', 'not-loaded', false);

        const guardResult = TestBed.runInInjectionContext(() => mkaPrivatpersonGuard()(route, state));

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
            expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).not.toHaveBeenCalled();

            // Die Session ist verfügbar, die MKA-Autorisierung fehlt noch.
            sessionLoadStateSubject.next('loaded');

            expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).toHaveBeenCalledOnce();
            expect(emittedResults).toEqual([]);
            expect(onComplete).not.toHaveBeenCalled();

            // Jetzt steht auch die MKA-Berechtigung fest.
            mkaAuthFacadeMock.isPrivatperson.set(true);
            authLoadStateSubject.next('loaded');

            expect(emittedResults).toEqual([true]);
            expect(onComplete).toHaveBeenCalledOnce();
            expect(subscription.closed).toBe(true);
        } finally {
            subscription.unsubscribe();
        }
    });

    it('should redirect users to minikaenguru start when sessionLoadState unauthorized', async () => {
        const { router } = setup('unauthorized', 'not-loaded', false);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).not.toHaveBeenCalled();
        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/home');
    });

    it('should redirect users to minikaenguru start when sessionLoadState technical-error', async () => {
        const { router } = setup('technical-error', 'not-loaded', false);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).not.toHaveBeenCalled();
        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/home');
    });

    it('should redirect users to minikaenguru start when mkaAuthorization failed', async () => {
        const { router } = setup('loaded', 'failed', false);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).toHaveBeenCalledOnce();
        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung');
    });

    it('should redirect users to minikaenguru start when loaded but not privatperson', async () => {
        const { router } = setup('loaded', 'loaded', false);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).toHaveBeenCalledOnce();
        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung');
    });

    it('should allow access for privatperson', async () => {
        setup('loaded', 'loaded', true);

        const result = await TestBed.runInInjectionContext(async () =>
            resolveGuardResult(mkaPrivatpersonGuard()(route, state))
        );

        expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).toHaveBeenCalledOnce();
        expect(result).toBeTruthy();
    });
});
