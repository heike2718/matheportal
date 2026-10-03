import { TestBed } from '@angular/core/testing';
import {
    ActivatedRouteSnapshot,
    GuardResult,
    MaybeAsync,
    provideRouter,
    Router,
    RouterStateSnapshot,
    convertToParamMap,
} from '@angular/router';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { BehaviorSubject, firstValueFrom, isObservable, Observable, Subject } from 'rxjs';
import { SchuleFacade } from './schule.facade';
import { mkaSchuleGuard } from './mka-schule.guard';

// Fehlende Tests: schulkuerzel undefined
// RESOURCE_LOAD_STATE Ltechnical-error' und 'unauthorized
// warten auf wettbewerbskontextLoadingState$ testen
describe('mkaSchuleGuard', () => {
    const schulkuerzel = 'S123457';
    const state = {} as RouterStateSnapshot;

    let route: ActivatedRouteSnapshot;

    let wettbewerbskontextLoadingStateSubject: Subject<RESOURCE_LOAD_STATE>;

    let schuleFacadeMock: {
        wettbewerbskontextLoadingState$: Observable<RESOURCE_LOAD_STATE>;
        dashboardVorbereiten: ReturnType<typeof vi.fn>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(wettbewerbskontextLoadingState: RESOURCE_LOAD_STATE, schulkuerzel: string | undefined) {
        wettbewerbskontextLoadingStateSubject = new BehaviorSubject<RESOURCE_LOAD_STATE>(
            wettbewerbskontextLoadingState
        );
        schuleFacadeMock = {
            wettbewerbskontextLoadingState$: wettbewerbskontextLoadingStateSubject.asObservable(),
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
        wettbewerbskontextLoadingStateSubject.next('loaded');

        const result = await resultPromise;

        expect(result).toBe(true);
    });
});
