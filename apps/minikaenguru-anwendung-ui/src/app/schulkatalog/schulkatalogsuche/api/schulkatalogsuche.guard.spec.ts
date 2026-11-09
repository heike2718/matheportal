import {
    ActivatedRouteSnapshot,
    GuardResult,
    MaybeAsync,
    provideRouter,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { RESTRICTED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { BehaviorSubject, firstValueFrom, isObservable, Observable, Subject } from 'rxjs';
import { AuthorizationLoadState, MINIKAENGURU_BERECHTIGUNGSTYP } from '../../../core/authorization/authorization-model';
import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PortalSessionFacade } from '@matheportal/auth-api';
import { MkaAuthorizationFacade } from '../../../core/authorization/authorization-api/mka-authorization.facade';
import { mkaSchulkatalogsucheGuard } from './schulkatalogsuche.guard';

describe('mkaSchulkatalogsucheGuard', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let sessionLoadStateSubject: Subject<RESTRICTED_RESOURCE_LOAD_STATE>;
    let authLoadStateSubject: Subject<AuthorizationLoadState>;

    let mkaAuthFacadeMock: {
        authorizationLoadState$: Observable<AuthorizationLoadState>;
        berechtigungstyp: WritableSignal<MINIKAENGURU_BERECHTIGUNGSTYP>;
        ensureAuthorizationLoaded: ReturnType<typeof vi.fn>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(
        sessionLoadState: RESTRICTED_RESOURCE_LOAD_STATE,
        authLoadState: AuthorizationLoadState,
        berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP
    ) {
        sessionLoadStateSubject = new BehaviorSubject<RESTRICTED_RESOURCE_LOAD_STATE>(sessionLoadState);
        authLoadStateSubject = new BehaviorSubject<AuthorizationLoadState>(authLoadState);

        mkaAuthFacadeMock = {
            authorizationLoadState$: authLoadStateSubject.asObservable(),
            berechtigungstyp: signal(berechtigungstyp),
            ensureAuthorizationLoaded: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                {
                    provide: PortalSessionFacade,
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

    describe('tests with sessionLoadState', () => {
        it.each(['not-found', 'unauthorized', 'technical-error'] as const)(
            'should redirect users to portal home immediately when sessionLoadState %s',
            async sesionLoadState => {
                const { router } = setup(sesionLoadState, 'not-loaded', MINIKAENGURU_BERECHTIGUNGSTYP.none);

                const result = await TestBed.runInInjectionContext(async () =>
                    resolveGuardResult(mkaSchulkatalogsucheGuard()(route, state))
                );

                expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).not.toHaveBeenCalled();

                expect(result).toBeInstanceOf(UrlTree);
                expect(router.serializeUrl(result as UrlTree)).toBe('/home');
            }
        );
    });

    describe('tests with berechtigungstyp', () => {
        it('should redirect to privatperson when logged in as privatperson', async () => {
            const { router } = setup('loaded', 'loaded', MINIKAENGURU_BERECHTIGUNGSTYP.privat);

            const result = await TestBed.runInInjectionContext(async () =>
                resolveGuardResult(mkaSchulkatalogsucheGuard()(route, state))
            );

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/privatperson');
        });
        it.each([MINIKAENGURU_BERECHTIGUNGSTYP.none, MINIKAENGURU_BERECHTIGUNGSTYP.schule] as const)(
            'should return true when berechtigungstyp %s',
            async berechtigungstyp => {
                setup('loaded', 'loaded', berechtigungstyp);

                const resultPromise = TestBed.runInInjectionContext(() =>
                    resolveGuardResult(mkaSchulkatalogsucheGuard()(route, state))
                );

                const result = await resultPromise;

                expect(result).toBe(true);
            }
        );
    });

    describe('wait tests', () => {
        it('should wait for session and mkaAuthoruzation before allowing access', async () => {
            setup('not-loaded', 'not-loaded', MINIKAENGURU_BERECHTIGUNGSTYP.none);

            const guardResult = TestBed.runInInjectionContext(() => mkaSchulkatalogsucheGuard()(route, state));

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

                expect(emittedResults).toEqual([]);
                expect(onComplete).not.toHaveBeenCalled();

                // die Autorisierung für Minikänguru kommt an
                mkaAuthFacadeMock.berechtigungstyp.set(MINIKAENGURU_BERECHTIGUNGSTYP.schule);
                authLoadStateSubject.next('loaded');

                expect(emittedResults).toEqual([true]);
                expect(onComplete).toHaveBeenCalledOnce();
                expect(subscription.closed).toBe(true);
            } finally {
                subscription.unsubscribe();
            }
        });
    });
});
