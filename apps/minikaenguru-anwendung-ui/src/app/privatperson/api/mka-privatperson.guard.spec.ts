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
import { TestBed } from '@angular/core/testing';
import { mkaPrivatpersonGuard } from './mka-privatperson.guard';
import { AUTHORIZED_RESOURCE_LOAD_STATE, RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { AuthSessionFacade } from '@matheportal/auth-api';
import { AuthorizationLoadState } from '../../core/authorization/authorization-model';
import { MkaAuthorizationFacade } from '../../core/authorization/authorization-api/mka-authorization.facade';
import { WettbewerbFacade } from '../../core/wettbewerb/api/wettbewerb.facade';
import { PrivatpersonFacade } from './privatperson.facade';

// TODO: Bei Einführung von Child-Routes unter dashboard-privatperson zusätzliche Tests für die child routes
// - Privatperson darf Child-Route aktivieren
// - Lehrperson wird blockiert/umgeleitet
// - anonymer User wird blockiert/umgeleitet

describe('mkaPrivatpersonGuard tests', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let sessionLoadStateSubject: Subject<RESOURCE_LOAD_STATE>;
    let authLoadStateSubject: Subject<AuthorizationLoadState>;

    let wettbewerbskontextLoadStateSubject: Subject<AUTHORIZED_RESOURCE_LOAD_STATE>;
    let wettbewerbLoadStateSubject: Subject<RESOURCE_LOAD_STATE>;

    let mkaAuthFacadeMock: {
        authorizationLoadState$: Observable<AuthorizationLoadState>;
        ensureAuthorizationLoaded: ReturnType<typeof vi.fn>;
    };

    let wettbewerbFacadeMock: {
        wettbewerbLoadState$: Observable<RESOURCE_LOAD_STATE>;
        ensureWettbewerbGeladen: ReturnType<typeof vi.fn>;
    };

    let privatpersonFacadeMock: {
        wettbewerbskontextLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE>;
        dashboardVorbereiten: ReturnType<typeof vi.fn>;
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
        wettbewerbLoadState: RESOURCE_LOAD_STATE,
        wettbewerbskontextLoadState: AUTHORIZED_RESOURCE_LOAD_STATE
    ) {
        sessionLoadStateSubject = new BehaviorSubject<RESOURCE_LOAD_STATE>(sessionLoadState);
        authLoadStateSubject = new BehaviorSubject<AuthorizationLoadState>(authLoadState);
        wettbewerbLoadStateSubject = new BehaviorSubject<RESOURCE_LOAD_STATE>(wettbewerbLoadState);
        wettbewerbskontextLoadStateSubject = new BehaviorSubject<AUTHORIZED_RESOURCE_LOAD_STATE>(
            wettbewerbskontextLoadState
        );

        mkaAuthFacadeMock = {
            authorizationLoadState$: authLoadStateSubject.asObservable(),
            ensureAuthorizationLoaded: vi.fn(),
        };

        wettbewerbFacadeMock = {
            wettbewerbLoadState$: wettbewerbLoadStateSubject.asObservable(),
            ensureWettbewerbGeladen: vi.fn(),
        };

        privatpersonFacadeMock = {
            wettbewerbskontextLoadState$: wettbewerbskontextLoadStateSubject.asObservable(),
            dashboardVorbereiten: vi.fn(),
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
                { provide: WettbewerbFacade, useValue: wettbewerbFacadeMock },
                { provide: PrivatpersonFacade, useValue: privatpersonFacadeMock },
            ],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    describe('tests with authorizationLoadState', () => {
        it('should allow access when mkaAuthorization arrives later', async () => {
            setup('loaded', 'not-loaded', 'loaded', 'loaded');

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaPrivatpersonGuard()(route, state))
            );

            authLoadStateSubject.next('loaded');

            const result = await resultPromise;

            expect(result).toBe(true);
        });

        it('should redirect to guests when authLoadState is failed', async () => {
            const { router } = setup('loaded', 'failed', 'loaded', 'loaded');

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaPrivatpersonGuard()(route, state))
            );

            const result = await resultPromise;

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/guests');
        });
    });

    describe('tests with wettbewerbLoadState', () => {
        it('should allow access when wettbewerb arrives later', async () => {
            setup('loaded', 'loaded', 'not-loaded', 'loaded');

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaPrivatpersonGuard()(route, state))
            );

            wettbewerbLoadStateSubject.next('loaded');

            const result = await resultPromise;

            expect(result).toBe(true);
        });

        it.each(['unauthorized', 'technical-error'] as const)(
            'should redirect to guests when wettbewerbLoadState is %s',
            async wettbewerbLoadState => {
                const { router } = setup('loaded', 'loaded', wettbewerbLoadState, 'loaded');

                const resultPromise = TestBed.runInInjectionContext(() =>
                    resolveGuardResult(mkaPrivatpersonGuard()(route, state))
                );

                const result = await resultPromise;

                expect(result).toBeInstanceOf(UrlTree);
                expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/guests');
            }
        );
    });

    describe('tests with wettbewerbskontextLoadState', () => {
        it('should allow access when wettbewerbskontext arrives later', async () => {
            setup('loaded', 'loaded', 'loaded', 'not-loaded');

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaPrivatpersonGuard()(route, state))
            );

            wettbewerbskontextLoadStateSubject.next('loaded');

            const result = await resultPromise;

            expect(result).toBe(true);
        });

        it.each(['unauthorized', 'forbidden', 'technical-error'] as const)(
            'should redirect to guests when wettbewerbskontextLoadState is %s',
            async kontextLoadState => {
                const { router } = setup('loaded', 'loaded', 'loaded', kontextLoadState);

                const resultPromise = TestBed.runInInjectionContext(() =>
                    resolveGuardResult(mkaPrivatpersonGuard()(route, state))
                );

                const result = await resultPromise;

                expect(result).toBeInstanceOf(UrlTree);
                expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/guests');
            }
        );
    });

    describe('tests with sessionLoadState', () => {
        it('should redirect users to home when sessionLoadState unauthorized', async () => {
            const { router } = setup('unauthorized', 'not-loaded', 'not-loaded', 'not-loaded');

            const result = await TestBed.runInInjectionContext(async () =>
                resolveGuardResult(mkaPrivatpersonGuard()(route, state))
            );

            expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).not.toHaveBeenCalled();
            expect(wettbewerbFacadeMock.ensureWettbewerbGeladen).not.toHaveBeenCalledOnce();
            expect(privatpersonFacadeMock.dashboardVorbereiten).not.toHaveBeenCalledOnce();

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/home');
        });

        it('should redirect users to portal home when sessionLoadState technical-error', async () => {
            const { router } = setup('technical-error', 'not-loaded', 'not-loaded', 'not-loaded');

            const result = await TestBed.runInInjectionContext(async () =>
                resolveGuardResult(mkaPrivatpersonGuard()(route, state))
            );

            expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).not.toHaveBeenCalled();
            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/home');
        });
    });

    describe('wait tests', () => {
        it('should wait for session, mkaAuthoruzation, wettbewerb and wettbewerbskontext before allowing access', async () => {
            setup('not-loaded', 'not-loaded', 'not-loaded', 'not-loaded');

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
                expect(wettbewerbFacadeMock.ensureWettbewerbGeladen).not.toHaveBeenCalled();
                expect(privatpersonFacadeMock.dashboardVorbereiten).not.toHaveBeenCalled();

                // Die Session ist verfügbar, die MKA-Autorisierung fehlt noch.
                sessionLoadStateSubject.next('loaded');

                expect(emittedResults).toEqual([]);
                expect(onComplete).not.toHaveBeenCalled();

                // die Autorisierung für Minikänguru kommt an
                authLoadStateSubject.next('loaded');

                expect(emittedResults).toEqual([]);
                expect(onComplete).not.toHaveBeenCalled();

                // der Wettbewerb kommt an
                wettbewerbLoadStateSubject.next('loaded');

                expect(emittedResults).toEqual([]);
                expect(onComplete).not.toHaveBeenCalled();

                // der Wettebwerbskontext kommt an
                wettbewerbskontextLoadStateSubject.next('loaded');

                expect(emittedResults).toEqual([true]);
                expect(onComplete).toHaveBeenCalledOnce();
                expect(subscription.closed).toBe(true);

                expect(mkaAuthFacadeMock.ensureAuthorizationLoaded).toHaveBeenCalledOnce();
                expect(wettbewerbFacadeMock.ensureWettbewerbGeladen).toHaveBeenCalledOnce();
                expect(privatpersonFacadeMock.dashboardVorbereiten).toHaveBeenCalledOnce();
            } finally {
                subscription.unsubscribe();
            }
        });
    });
});
