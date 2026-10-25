import { TestBed } from '@angular/core/testing';
import {
    ActivatedRouteSnapshot,
    GuardResult,
    MaybeAsync,
    provideRouter,
    Router,
    RouterStateSnapshot,
    convertToParamMap,
    UrlTree,
} from '@angular/router';
import { AUTHORIZED_RESOURCE_LOAD_STATE, RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { BehaviorSubject, firstValueFrom, isObservable, Observable, Subject } from 'rxjs';
import { SchuleFacade } from './schule.facade';
import { mkaSchuleGuard } from './mka-schule.guard';
import { WettbewerbFacade } from '../../core/wettbewerb/api/wettbewerb.facade';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { schulenLadenVerweigert } from '../../lehrperson/api/public-lehrperson.selectors';

// Fehlende Tests: schulkuerzel undefined
// AUTHORIZED_RESOURCE_LOAD_STATE technical-error' und 'unauthorized
// warten auf wettbewerbskontextLoadState$ testen
describe('mkaSchuleGuard', () => {
    const schulkuerzel = 'S123457';
    const state = {} as RouterStateSnapshot;

    let route: ActivatedRouteSnapshot;

    let store: MockStore;

    let wettbewerbskontextLoadStateSubject: Subject<AUTHORIZED_RESOURCE_LOAD_STATE>;
    let wettbewerbLoadStateSubject: Subject<RESOURCE_LOAD_STATE>;

    let schuleFacadeMock: {
        wettbewerbskontextLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE>;
        dashboardVorbereiten: ReturnType<typeof vi.fn>;
    };

    let wettbewerbFacadeMock: {
        wettbewerbLoadState$: Observable<RESOURCE_LOAD_STATE>;
        ensureWettbewerbGeladen: ReturnType<typeof vi.fn>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(
        wettbewerbskontextLoadState: AUTHORIZED_RESOURCE_LOAD_STATE,
        wettbwerbLoadState: RESOURCE_LOAD_STATE,
        schulkuerzel: string | undefined,
        forbidden: boolean
    ) {
        wettbewerbskontextLoadStateSubject = new BehaviorSubject<AUTHORIZED_RESOURCE_LOAD_STATE>(
            wettbewerbskontextLoadState
        );
        wettbewerbLoadStateSubject = new BehaviorSubject<RESOURCE_LOAD_STATE>(wettbwerbLoadState);
        schuleFacadeMock = {
            wettbewerbskontextLoadState$: wettbewerbskontextLoadStateSubject.asObservable(),
            dashboardVorbereiten: vi.fn(),
        };

        wettbewerbFacadeMock = {
            wettbewerbLoadState$: wettbewerbLoadStateSubject.asObservable(),
            ensureWettbewerbGeladen: vi.fn(),
        };

        route = {
            paramMap: convertToParamMap(schulkuerzel === undefined ? {} : { schulkuerzel }),
        } as ActivatedRouteSnapshot;

        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                provideMockStore(),
                { provide: SchuleFacade, useValue: schuleFacadeMock },
                { provide: WettbewerbFacade, useValue: wettbewerbFacadeMock },
            ],
        });

        const router = TestBed.inject(Router);
        store = TestBed.inject(Store) as MockStore;

        store.overrideSelector(schulenLadenVerweigert, forbidden);
        store.refreshState();

        vi.resetAllMocks();

        return { router };
    }

    describe('tests with wettbwerbskontextLoadState', () => {
        it('should allow access when wettbewerbskontext arrives later', async () => {
            setup('not-loaded', 'loaded', schulkuerzel, false);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaSchuleGuard()(route, state))
            );

            expect(wettbewerbFacadeMock.ensureWettbewerbGeladen).toHaveBeenCalledOnce();
            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledOnce();
            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledWith(schulkuerzel);

            // Zuerst die Berechtigung setzen, dann die Autorisierung abschließen.
            wettbewerbskontextLoadStateSubject.next('loaded');

            const result = await resultPromise;

            expect(result).toBe(true);
        });

        it.each(['loaded', 'not-loaded', 'unauthorized', 'forbidden', 'technical-error'] as const)(
            'should not allow when schulkuerzel undefined and load state %s',
            async loadState => {
                const { router } = setup(loadState, 'loaded', undefined, false);

                const resultPromise = TestBed.runInInjectionContext(() =>
                    resolveGuardResult(mkaSchuleGuard()(route, state))
                );

                expect(schuleFacadeMock.dashboardVorbereiten).not.toHaveBeenCalled();

                const result = await resultPromise;

                expect(result).toBeInstanceOf(UrlTree);
                expect(router.serializeUrl(result as UrlTree)).toBe('/home');
            }
        );

        it.each(['unauthorized', 'forbidden'] as const)(
            'should redirect to lehrperson when load state becomes %s',
            async loadState => {
                const { router } = setup('not-loaded', 'loaded', schulkuerzel, false);

                const resultPromise = TestBed.runInInjectionContext(() =>
                    resolveGuardResult(mkaSchuleGuard()(route, state))
                );

                expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledOnce();
                expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledWith(schulkuerzel);

                wettbewerbskontextLoadStateSubject.next(loadState);

                const result = await resultPromise;

                expect(result).toBeInstanceOf(UrlTree);
                expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/lehrperson');
            }
        );

        it('should redirect to ladefehler when load state becomes technical-error', async () => {
            const { router } = setup('not-loaded', 'loaded', schulkuerzel, false);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaSchuleGuard()(route, state))
            );

            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledOnce();
            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledWith(schulkuerzel);

            wettbewerbskontextLoadStateSubject.next('technical-error');

            const result = await resultPromise;

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/ladefehler');
        });

        it('should wait while wettbewerbskontext is not-loaded', () => {
            setup('not-loaded', 'loaded', schulkuerzel, false);

            const result = TestBed.runInInjectionContext(() => mkaSchuleGuard()(route, state));

            if (!isObservable(result)) {
                throw new Error('Expected an Observable guard result');
            }

            const next = vi.fn();
            const complete = vi.fn();
            const subscription = result.subscribe({ next, complete });

            try {
                wettbewerbskontextLoadStateSubject.next('not-loaded');

                expect(next).not.toHaveBeenCalled();
                expect(complete).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('tests with wettbwerbLoadState', () => {
        it('should allow access when wettbwerb arrives later', async () => {
            setup('loaded', 'not-loaded', schulkuerzel, false);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaSchuleGuard()(route, state))
            );

            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledOnce();
            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledWith(schulkuerzel);

            // Zuerst die Berechtigung setzen, dann die Autorisierung abschließen.
            wettbewerbLoadStateSubject.next('loaded');

            const result = await resultPromise;

            expect(result).toBe(true);
        });

        it.each(['loaded', 'not-loaded', 'unauthorized', 'technical-error'] as const)(
            'should not allow when schulkuerzel undefined and load state %s',
            async loadState => {
                const { router } = setup('loaded', loadState, undefined, false);

                const resultPromise = TestBed.runInInjectionContext(() =>
                    resolveGuardResult(mkaSchuleGuard()(route, state))
                );

                expect(schuleFacadeMock.dashboardVorbereiten).not.toHaveBeenCalled();
                expect(wettbewerbFacadeMock.ensureWettbewerbGeladen).not.toHaveBeenCalled();

                const result = await resultPromise;

                expect(result).toBeInstanceOf(UrlTree);
                expect(router.serializeUrl(result as UrlTree)).toBe('/home');
            }
        );

        it.each(['loaded', 'not-loaded', 'unauthorized', 'technical-error'] as const)(
            'should not allow when schulkuerzel defined but schulenLadenVerweigert and load state %s',
            async loadState => {
                const { router } = setup('loaded', loadState, schulkuerzel, true);

                const resultPromise = TestBed.runInInjectionContext(() =>
                    resolveGuardResult(mkaSchuleGuard()(route, state))
                );

                expect(schuleFacadeMock.dashboardVorbereiten).not.toHaveBeenCalled();
                expect(wettbewerbFacadeMock.ensureWettbewerbGeladen).not.toHaveBeenCalled();

                const result = await resultPromise;

                expect(result).toBeInstanceOf(UrlTree);
                expect(router.serializeUrl(result as UrlTree)).toBe('/home');
            }
        );

        it('should redirect to lehrperson when load state becomes unauthorized', async () => {
            const { router } = setup('loaded', 'not-loaded', schulkuerzel, false);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaSchuleGuard()(route, state))
            );

            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledOnce();
            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledWith(schulkuerzel);

            wettbewerbLoadStateSubject.next('unauthorized');

            const result = await resultPromise;

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/lehrperson');
        });

        it('should redirect to ladefehler when load state becomes technical-error', async () => {
            const { router } = setup('loaded', 'not-loaded', schulkuerzel, false);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaSchuleGuard()(route, state))
            );

            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledOnce();
            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledWith(schulkuerzel);

            wettbewerbLoadStateSubject.next('technical-error');

            const result = await resultPromise;

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/ladefehler');
        });

        it('should wait while wettbewerb is not-loaded', () => {
            setup('loaded', 'not-loaded', schulkuerzel, false);

            const result = TestBed.runInInjectionContext(() => mkaSchuleGuard()(route, state));

            if (!isObservable(result)) {
                throw new Error('Expected an Observable guard result');
            }

            const next = vi.fn();
            const complete = vi.fn();
            const subscription = result.subscribe({ next, complete });

            try {
                wettbewerbLoadStateSubject.next('not-loaded');

                expect(next).not.toHaveBeenCalled();
                expect(complete).not.toHaveBeenCalled();
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('warten bis zweites loaded', () => {
        it('should wait - first wettbewerbskontext', () => {
            setup('not-loaded', 'not-loaded', schulkuerzel, false);

            const result = TestBed.runInInjectionContext(() => mkaSchuleGuard()(route, state));

            if (!isObservable(result)) {
                throw new Error('Expected an Observable guard result');
            }

            const next = vi.fn();
            const complete = vi.fn();
            const subscription = result.subscribe({ next, complete });
            try {
                expect(next).not.toHaveBeenCalled();
                expect(complete).not.toHaveBeenCalled();

                wettbewerbskontextLoadStateSubject.next('loaded');

                expect(next).not.toHaveBeenCalled();
                expect(complete).not.toHaveBeenCalled();

                wettbewerbLoadStateSubject.next('loaded');

                expect(next).toHaveBeenCalledExactlyOnceWith(true);
                expect(complete).toHaveBeenCalledOnce();
                expect(subscription.closed).toBe(true);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should wait - first wettbwerb', () => {
            setup('not-loaded', 'not-loaded', schulkuerzel, false);

            const result = TestBed.runInInjectionContext(() => mkaSchuleGuard()(route, state));

            if (!isObservable(result)) {
                throw new Error('Expected an Observable guard result');
            }

            const next = vi.fn();
            const complete = vi.fn();
            const subscription = result.subscribe({ next, complete });
            try {
                expect(next).not.toHaveBeenCalled();
                expect(complete).not.toHaveBeenCalled();

                wettbewerbLoadStateSubject.next('loaded');

                expect(next).not.toHaveBeenCalled();
                expect(complete).not.toHaveBeenCalled();

                wettbewerbskontextLoadStateSubject.next('loaded');

                expect(next).toHaveBeenCalledExactlyOnceWith(true);
                expect(complete).toHaveBeenCalledOnce();
                expect(subscription.closed).toBe(true);
            } finally {
                subscription.unsubscribe();
            }
        });
    });

    describe('redirect bei erstem fehlerstatus', () => {
        it('should redirect immediately when wettbewerbskontext with failure state', () => {
            const { router } = setup('not-loaded', 'not-loaded', schulkuerzel, false);

            const result = TestBed.runInInjectionContext(() => mkaSchuleGuard()(route, state));

            if (!isObservable(result)) {
                throw new Error('Expected an Observable guard result');
            }

            const next = vi.fn();
            const complete = vi.fn();
            const subscription = result.subscribe({ next, complete });
            try {
                expect(next).not.toHaveBeenCalled();
                expect(complete).not.toHaveBeenCalled();

                wettbewerbskontextLoadStateSubject.next('technical-error');

                expect(next).toHaveBeenCalledOnce();

                const emittedResult = next.mock.calls[0][0];
                expect(emittedResult).toBeInstanceOf(UrlTree);
                expect(router.serializeUrl(emittedResult as UrlTree)).toBe('/minikaenguru-anwendung/ladefehler');

                expect(complete).toHaveBeenCalledOnce();
                expect(subscription.closed).toBe(true);
            } finally {
                subscription.unsubscribe();
            }
        });

        it('should redirect immediately when wettbewerb with failure state', () => {
            const { router } = setup('not-loaded', 'not-loaded', schulkuerzel, false);

            const result = TestBed.runInInjectionContext(() => mkaSchuleGuard()(route, state));

            if (!isObservable(result)) {
                throw new Error('Expected an Observable guard result');
            }

            const next = vi.fn();
            const complete = vi.fn();
            const subscription = result.subscribe({ next, complete });
            try {
                expect(next).not.toHaveBeenCalled();
                expect(complete).not.toHaveBeenCalled();

                wettbewerbLoadStateSubject.next('unauthorized');

                expect(next).toHaveBeenCalledOnce();

                const emittedResult = next.mock.calls[0][0];
                expect(emittedResult).toBeInstanceOf(UrlTree);
                expect(router.serializeUrl(emittedResult as UrlTree)).toBe('/minikaenguru-anwendung/lehrperson');

                expect(complete).toHaveBeenCalledOnce();
                expect(subscription.closed).toBe(true);
            } finally {
                subscription.unsubscribe();
            }
        });
    });
});
