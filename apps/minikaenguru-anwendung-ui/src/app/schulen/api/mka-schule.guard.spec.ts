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
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { BehaviorSubject, firstValueFrom, isObservable, Observable, Subject } from 'rxjs';
import { SchuleFacade } from './schule.facade';
import { mkaSchuleGuard } from './mka-schule.guard';

// Fehlende Tests: schulkuerzel undefined
// AUTHORIZED_RESOURCE_LOAD_STATE technical-error' und 'unauthorized
// warten auf wettbewerbskontextLoadState$ testen
describe('mkaSchuleGuard', () => {
    const schulkuerzel = 'S123457';
    const state = {} as RouterStateSnapshot;

    let route: ActivatedRouteSnapshot;

    let wettbewerbskontextLoadStateSubject: Subject<AUTHORIZED_RESOURCE_LOAD_STATE>;

    let schuleFacadeMock: {
        wettbewerbskontextLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE>;
        dashboardVorbereiten: ReturnType<typeof vi.fn>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(wettbewerbskontextLoadState: AUTHORIZED_RESOURCE_LOAD_STATE, schulkuerzel: string | undefined) {
        wettbewerbskontextLoadStateSubject = new BehaviorSubject<AUTHORIZED_RESOURCE_LOAD_STATE>(
            wettbewerbskontextLoadState
        );
        schuleFacadeMock = {
            wettbewerbskontextLoadState$: wettbewerbskontextLoadStateSubject.asObservable(),
            dashboardVorbereiten: vi.fn(),
        };

        route = {
            paramMap: convertToParamMap(schulkuerzel === undefined ? {} : { schulkuerzel }),
        } as ActivatedRouteSnapshot;

        TestBed.configureTestingModule({
            providers: [provideRouter([]), { provide: SchuleFacade, useValue: schuleFacadeMock }],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should allow access when wettbewerbskontext arrives later', async () => {
        setup('not-loaded', schulkuerzel);

        const resultPromise = TestBed.runInInjectionContext(() => resolveGuardResult(mkaSchuleGuard()(route, state)));

        expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledOnce();
        expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledWith(schulkuerzel);

        // Zuerst die Berechtigung setzen, dann die Autorisierung abschließen.
        wettbewerbskontextLoadStateSubject.next('loaded');

        const result = await resultPromise;

        expect(result).toBe(true);
    });

    it.each(['loaded', 'not-loaded', 'unauthorized', 'forbidden', 'technical-error'] as const)(
        'should not allow when schulkuerzel undefined and load state %s',
        async LoadState => {
            const { router } = setup(LoadState, undefined);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaSchuleGuard()(route, state))
            );

            expect(schuleFacadeMock.dashboardVorbereiten).not.toHaveBeenCalled();

            const result = await resultPromise;

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/home');
        }
    );

    it.each(['unauthorized', 'forbidden', 'technical-error'] as const)(
        'should redirect to lehrperson when loading state becomes %s',
        async LoadState => {
            const { router } = setup('not-loaded', schulkuerzel);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaSchuleGuard()(route, state))
            );

            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledOnce();
            expect(schuleFacadeMock.dashboardVorbereiten).toHaveBeenCalledWith(schulkuerzel);

            wettbewerbskontextLoadStateSubject.next(LoadState);

            const result = await resultPromise;

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/lehrperson');
        }
    );

    it('should wait while wettbewerbskontext is not-loaded', () => {
        setup('not-loaded', schulkuerzel);

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
