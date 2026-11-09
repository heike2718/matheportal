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
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { BehaviorSubject, firstValueFrom, isObservable, Observable, Subject } from 'rxjs';
import { TeilnahmeFacade } from './teilnahme.facade';
import { mkaPrivatteilnahmeGuard } from './mka-privatteilnahme.guard';

describe('mkaPrivatteilnahmeGuard', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    let teilnahmeLoadStateSubject: Subject<AUTHORIZED_RESOURCE_LOAD_STATE>;

    let teilnahmeFacadeMock: {
        teilnahmeLoadState$: Observable<AUTHORIZED_RESOURCE_LOAD_STATE>;
        aktuellePrivatteilnahmeVorbereiten: ReturnType<typeof vi.fn>;
    };

    async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
        if (isObservable(result)) {
            return firstValueFrom(result);
        }

        return Promise.resolve(result as GuardResult);
    }

    function setup(teilhameLoadState: AUTHORIZED_RESOURCE_LOAD_STATE) {
        teilnahmeLoadStateSubject = new BehaviorSubject<AUTHORIZED_RESOURCE_LOAD_STATE>(teilhameLoadState);

        teilnahmeFacadeMock = {
            teilnahmeLoadState$: teilnahmeLoadStateSubject.asObservable(),
            aktuellePrivatteilnahmeVorbereiten: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                {
                    provide: TeilnahmeFacade,
                    useValue: teilnahmeFacadeMock,
                },
            ],
        });

        const router = TestBed.inject(Router);

        return { router };
    }

    it('should trigger preparation and allow access when teilnahme arrives later', async () => {
        setup('not-loaded');

        const resultPromise = TestBed.runInInjectionContext(() =>
            resolveGuardResult(mkaPrivatteilnahmeGuard()(route, state))
        );

        expect(teilnahmeFacadeMock.aktuellePrivatteilnahmeVorbereiten).toHaveBeenCalledOnce();

        teilnahmeLoadStateSubject.next('loaded');

        const result = await resultPromise;

        expect(result).toBe(true);
    });

    it.each(['unauthorized', 'forbidden', 'not-found'] as const)(
        'should navigate to DashboardPrivat when state is %s',
        async loadState => {
            const { router } = setup(loadState);

            const resultPromise = TestBed.runInInjectionContext(() =>
                resolveGuardResult(mkaPrivatteilnahmeGuard()(route, state))
            );

            const result = await resultPromise;

            expect(result).toBeInstanceOf(UrlTree);
            expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/privatperson');
        }
    );

    it('should navigate to ladefehler when technical-error', async () => {
        const { router } = setup('technical-error');

        const resultPromise = TestBed.runInInjectionContext(() =>
            resolveGuardResult(mkaPrivatteilnahmeGuard()(route, state))
        );

        const result = await resultPromise;

        expect(result).toBeInstanceOf(UrlTree);
        expect(router.serializeUrl(result as UrlTree)).toBe('/minikaenguru-anwendung/ladefehler');
    });
});
